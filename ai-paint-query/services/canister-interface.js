import { Actor, HttpAgent } from '@dfinity/agent'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

/**
 * Environment Configuration
 *
 * We use environment variables to handle different deployment scenarios:
 * - IC_HOST: The Internet Computer host (defaults to local replica)
 * - PAINT_TRANSLATOR_CANISTER_ID: The canister identifier
 * - IC_LOCAL: Boolean flag to indicate if we're running locally
 */
const canisterId = process.env.PAINT_TRANSLATOR_CANISTER_ID
const host = process.env.IC_HOST || 'http://localhost:4943'
const isLocal = process.env.IC_LOCAL === 'true'

// Verify we have the necessary configuration
if (!canisterId) {
  throw new Error('PAINT_TRANSLATOR_CANISTER_ID must be set in environment')
}

/**
 * Create and configure the Internet Computer HTTP agent.
 * When running locally, we need to fetch the root key.
 */
const agent = new HttpAgent({ host })

if (isLocal) {
  agent.fetchRootKey().catch((err) => {
    console.warn(
      'Unable to fetch root key. Check if your local replica is running'
    )
    console.error(err)
  })
}

/**
 * Define the Interface Description Language (IDL) factory.
 * This creates a contract between our JavaScript code and the Motoko canister,
 * ensuring type safety in our communications.
 */
const idlFactory = ({ IDL }) => {
  // Define the structure for our API queries
  const APIQuery = IDL.Record({
    query_type: IDL.Text, // Type of query (e.g., 'temperature', 'maxvoc')
    value: IDL.Text, // The query value (e.g., temperature value, VOC limit)
  })

  // Define what a cached translation entry looks like
  const TranslationEntry = IDL.Record({
    natural_query: IDL.Text, // The original natural language query
    structured_query: APIQuery, // The translated structured query
    api_response: IDL.Text, // The Paint API response (stored as JSON string)
  })

  // Define the canister's interface methods
  return IDL.Service({
    check_cache: IDL.Func([IDL.Text], [IDL.Opt(TranslationEntry)], ['query']),
    store_translation: IDL.Func(
      [IDL.Text, IDL.Text, IDL.Text, IDL.Text],
      [],
      []
    ),
    clear_cache: IDL.Func([], [], []),
  })
}

// Create the actor (our interface to the canister)
export const canister = Actor.createActor(idlFactory, {
  agent,
  canisterId,
})

/**
 * Queries the Paint data translation system.
 * First checks the cache for existing translations before requesting a new one.
 *
 * @param {string} naturalQuery - The natural language query (e.g., "What paints work at 25 degrees?")
 * @returns {Object|null} - The cached API response or null if not found
 */
export async function queryPaintData(naturalQuery) {
  console.log('Checking cache for query:', naturalQuery)
  try {
    // First, check if we have this query cached
    const cached = await canister.check_cache(naturalQuery)

    // Canister returns an array
    // If we found a cached result, parse and return it
    if (cached.length > 0) {
      return JSON.parse(cached[0].api_response)
    }

    // If not in cache, return null so the AI agent knows to process it
    return null
  } catch (error) {
    console.error('Canister query failed:', error)
    return null
  }
}

/**
 * Stores a new translation in the canister's cache.
 * Called after the AI agent has processed a new query.
 *
 * @param {string} naturalQuery - The original natural language query
 * @param {Object} structuredQuery - The AI-translated structured query
 * @param {Object} apiResponse - The response received from the Paint API
 */
export async function storeTranslation(
  naturalQuery,
  structuredQuery,
  apiResponse
) {
  try {
    await canister.store_translation(
      naturalQuery, // The original query
      structuredQuery.type, // Query type (e.g., 'temperature')
      structuredQuery.value, // Query value (e.g., 25)
      JSON.stringify(apiResponse) // Store API response as JSON string
    )
  } catch (error) {
    console.error('Store translation failed:', error)
  }
}

/**
 * Clears the cache in the Paint data translation system.
 * This is useful for testing and development purposes.
 */
export async function clearCache() {
  try {
    await canister.clear_cache()
    console.log('Cache cleared successfully')
  } catch (error) {
    console.error('Failed to clear cache:', error)
    throw error
  }
}

/**
 * Example .env file configuration:
 *
 * PAINT_TRANSLATOR_CANISTER_ID=your_canister_id_here
 * IC_HOST=http://localhost:4943
 * IC_LOCAL=true
 */
