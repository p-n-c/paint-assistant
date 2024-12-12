import axios from 'axios';
import { config } from '../config.js';

export async function queryPaintApi(params) {
  try {
    // Convert parameters to URL query string
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      queryParams.append(key, value);
    }

    // Make request to Paint API
    const response = await axios.get(`${config.paintApiUrl}/?${queryParams}`);
    
    return response.data;
  } catch (error) {
    if (error.response) {
      // API returned an error
      console.error('Paint API error:', error.response.data);
      throw new Error(error.response.data.error || 'Paint API error');
    } else {
      // Network or other error
      console.error('Failed to connect to Paint API:', error.message);
      throw new Error('Failed to connect to Paint API');
    }
  }
}