import { translateQuery } from './claude.js';
import { queryPaintApi } from './paint.js';

// Import your IC agent/canister configuration
import { canister } from '../handlers/canister-interface.js';

const POLLING_INTERVAL = 10000; // 10 seconds

async function processPendingQueries() {
  try {
    // 1. Get pending queries from canister
    const pendingQueries = await canister.get_pending_queries();
    
    for (const query of pendingQueries) {
      // 2. Mark query as being processed
      await canister.mark_processing(query);
      
      try {
        // 3. Translate query using Claude
        const parameters = await translateQuery(query);
        
        // 4. Call Paint API with translated parameters
        const apiResponse = await queryPaintApi(parameters);
        
        // 5. Store results in canister
        // Assuming parameters has a single key-value pair
        const [queryType, queryValue] = Object.entries(parameters)[0];
        await canister.store_translation(
          query,
          queryType,
          queryValue,
          apiResponse
        );
      } catch (error) {
        console.error(`Error processing query "${query}":`, error);
        // In a production system, you'd want to handle this more gracefully
        // For now, we'll just log the error and continue with next query
      }
    }
  } catch (error) {
    console.error('Error in processing loop:', error);
  }
}

// Start the polling service
function startPolling() {
  console.log('Starting polling service...');
  
  // Initial call
  processPendingQueries();
  
  // Set up regular polling
  setInterval(processPendingQueries, POLLING_INTERVAL);
}

export { startPolling };