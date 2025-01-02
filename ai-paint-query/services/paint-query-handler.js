/**
 * paint-integration.js
 * This file combines Claude AI translation and Paint API communication
 * into a single, streamlined service.
 */

import Anthropic from '@anthropic-ai/sdk'
import axios from 'axios'
import { config } from '../config/config.js'
import { canister } from './canister-interface.js'

// Initialize Anthropic client for Claude
const anthropic = new Anthropic({
  apiKey: config.claudeApiKey,
})

// Claude's system prompt for query translation
const SYSTEM_PROMPT = `You are a paint expert API translator. Convert natural language queries about paint into API parameters.
Available parameters: code, name, temperature, voc
Return only JSON object. Example: "paint for 35 degrees" -> {"temperature": 35}`

/**
 * Translates a natural language query to Paint API parameters using Claude
 */
export async function translateQuery(query) {
  const message = await anthropic.messages.create({
    model: 'claude-3-sonnet-20240229',
    max_tokens: 150,
    temperature: 0.0,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: `Translate: "${query}"` }],
  })

  return JSON.parse(message.content[0].text)
}

/**
 * Queries the Paint API with structured parameters
 */
export async function queryPaintApi(params) {
  const queryString = new URLSearchParams(params).toString()
  const response = await axios.get(`${config.paintApiUrl}/?${queryString}`)
  return response.data
}

/**
 * Main processing function that handles the complete flow:
 * 1. Checks cache
 * 2. Translates query if needed
 * 3. Calls Paint API
 * 4. Stores results
 */
export async function processQuery(naturalQuery) {
  try {
    // First check if we have a cached result
    const cached = await canister.check_cache(naturalQuery)
    if (cached.length > 0) return JSON.parse(cached.api_response)

    // If not cached, translate and process
    const parameters = await translateQuery(naturalQuery)
    const apiResponse = await queryPaintApi(parameters)

    // Store the result in cache
    const [queryType, queryValue] = Object.entries(parameters)[0]
    await canister.store_translation(
      naturalQuery,
      queryType,
      queryValue,
      JSON.stringify(apiResponse)
    )

    return apiResponse
  } catch (error) {
    console.error('Error processing query:', error)
    throw new Error('Failed to process paint query')
  }
}
