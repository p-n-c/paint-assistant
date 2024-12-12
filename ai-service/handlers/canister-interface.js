import { Actor, HttpAgent } from '@dfinity/agent';
import { IDL } from '@dfinity/candid';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get environment variables with defaults
const canisterId = process.env.PAINT_TRANSLATOR_CANISTER_ID;
const host = process.env.IC_HOST || 'http://localhost:4943';
const isLocal = process.env.IC_LOCAL === 'true';

if (!canisterId) {
  throw new Error('PAINT_TRANSLATOR_CANISTER_ID is not set in environment');
}

// Create an agent for talking to IC
const agent = new HttpAgent({ host });

// Configure agent for local development
if (isLocal) {
  agent.fetchRootKey().catch(err => {
    console.warn('Unable to fetch root key. Check to ensure your local replica is running');
    console.error(err);
  });
  agent.isLocal = true;
}

// Define the IDL factory
const idlFactory = ({ IDL }) => {
  const TranslationEntry = IDL.Record({
    'natural_query': IDL.Text,
    'structured_query': IDL.Record({
      'query_type': IDL.Text,
      'value': IDL.Nat,
    }),
    'api_response': IDL.Text,
    'timestamp': IDL.Int,
  });

  const PendingQuery = IDL.Record({
    'natural_query': IDL.Text,
    'timestamp': IDL.Int,
    'status': IDL.Text,
  });

  return IDL.Service({
    'check_cache': IDL.Func([IDL.Text], [IDL.Opt(TranslationEntry)], []),
    'get_pending_queries': IDL.Func([], [IDL.Vec(PendingQuery)], ['query']),
    'mark_processing': IDL.Func([IDL.Text], [], []),
    'store_translation': IDL.Func([IDL.Text, IDL.Text, IDL.Nat, IDL.Text], [], []),
  });
};

// Create an actor with the interface
const canister = Actor.createActor(idlFactory, {
  agent,
  canisterId,
});

// Wrapper functions for easier use
const canisterApi = {
  async check_cache(natural_query) {
    try {
      return await canister.check_cache(natural_query);
    } catch (error) {
      console.error('Error checking cache:', error);
      throw error;
    }
  },

  async get_pending_queries() {
    try {
      return await canister.get_pending_queries();
    } catch (error) {
      console.error('Error getting pending queries:', error);
      throw error;
    }
  },

  async mark_processing(natural_query) {
    try {
      await canister.mark_processing(natural_query);
    } catch (error) {
      console.error('Error marking query as processing:', error);
      throw error;
    }
  },

  async store_translation(natural_query, query_type, query_value, api_response) {
    try {
      await canister.store_translation(
        natural_query,
        query_type,
        Number(query_value), // Ensure query_value is converted to a number
        api_response
      );
    } catch (error) {
      console.error('Error storing translation:', error);
      throw error;
    }
  }
};

export { canisterApi as canister };