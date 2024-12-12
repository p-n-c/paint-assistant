import express from 'express';
import { startPolling } from './services/polling.js';
import { canister } from './handlers/canister-interface.js';

const app = express();
const port = 3001;

// Endpoint to check cache and queue if missing
app.get('/api/check', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const result = await canister.check_cache(query);
    
    if (result) {
      // Cache hit
      res.json({
        cached: true,
        result
      });
    } else {
      // Cache miss - query has been added to pending
      res.json({
        cached: false,
        message: 'Query added to processing queue'
      });
    }
  } catch (error) {
    console.error('Error checking cache:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the polling service
startPolling();

// Start the server
app.listen(port, () => {
  console.log(`AI Service running at http://localhost:${port}`);
});