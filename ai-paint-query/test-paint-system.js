// test-paint-system.js
import { processQuery } from './services/paint-query-handler.js'
import { queryPaintData, clearCache } from './services/canister-interface.js'
import { config } from './config/config.js'

/**
 * This test script demonstrates the complete flow of our paint query system:
 * 1. Natural language queries are processed
 * 2. The blockchain cache is checked
 * 3. If needed, queries are translated to API parameters
 * 4. Results are stored in the blockchain
 * 5. Responses are returned to the user
 */

// Test queries that demonstrate different types of paint-related questions
const TEST_QUERIES = [
  'What paints work at 40 degrees?',
  'Show me paints with VOC under 40',
  'Find paint code AX-117-R',
  'What paints work at 40 degrees?', // Repeated query to demonstrate caching
]

/**
 * Processes a single query and displays the results
 * @param {string} naturalQuery - The natural language query to process
 * @param {boolean} isRepeat - Whether this query has been seen before
 */
async function runSingleTest(naturalQuery, isRepeat = false) {
  console.log('\n' + '='.repeat(50))
  console.log(`Testing query: "${naturalQuery}"`)
  console.log('='.repeat(50))

  try {
    // Step 1: Check the blockchain cache
    console.log('\nChecking blockchain cache...')
    const cachedResult = await queryPaintData(naturalQuery)

    if (cachedResult) {
      console.log('Cache hit! Returning stored result:')
      console.log(JSON.stringify(cachedResult, null, 2))
      return cachedResult
    }

    console.log('No cached result found. Processing new query...')

    // Step 2: Process the query (includes translation and API call)
    const result = await processQuery(naturalQuery)

    console.log('\nQuery processed successfully:')
    console.log(JSON.stringify(result, null, 2))

    return result
  } catch (error) {
    console.error(`Error processing query: ${error.message}`)
    throw error
  }
}

/**
 * Main test function that runs through all test queries
 */
async function runAllTests() {
  console.log('Starting Paint Query System Tests')
  console.log('=================================')

  // Clear the cache before running tests
  await clearCache()
  console.log('Cache cleared, starting tests...')

  // Process each test query in sequence
  for (let i = 0; i < TEST_QUERIES.length; i++) {
    const query = TEST_QUERIES[i]
    const isRepeat = TEST_QUERIES.slice(0, i).includes(query)

    try {
      await runSingleTest(query, isRepeat)
    } catch (error) {
      console.error(`Test failed for query: "${query}"`)
      console.error(error)
    }
  }
}

// Run the tests
console.log('Paint Query System Test Harness')
console.log('===============================')
console.log('Configuration:')
console.log(`Paint API URL: ${config.paintApiUrl}`)
console.log(`Service Port: ${config.port}`)

runAllTests().catch((error) => {
  console.error('Test suite failed:', error)
  process.exit(1)
})
