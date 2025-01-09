// src/services/paintApiService.js
import axios from 'axios'

class PaintApiService {
  constructor(baseUrl) {
    this.api = axios.create({
      baseURL: baseUrl,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    })
  }

  async queryPaint(parameters) {
    try {
      // Parse parameters if they're provided as a string
      const queryParams =
        typeof parameters === 'string' ? JSON.parse(parameters) : parameters

      // Make the request with the properly formatted parameters
      const response = await this.api.get('', {
        params: queryParams,
      })

      return response.data
    } catch (error) {
      // Handle different types of errors appropriately
      if (error.response) {
        // Server returned an error response
        switch (error.response.status) {
          case 404:
            // Return empty array for "not found" responses
            console.info('No matching paints found for query:', parameters)
            return []

          case 400:
            // Bad request - likely invalid parameters
            console.error('Invalid query parameters:', {
              params: parameters,
              message: error.response.data.error,
            })
            throw new Error(
              `Invalid query parameters: ${error.response.data.error}`
            )

          case 405:
            // Method not allowed
            console.error('Invalid HTTP method used')
            throw new Error(
              'Invalid HTTP method: Only GET requests are supported'
            )

          default:
            // Handle other server errors (500, etc)
            console.error('Server error:', {
              status: error.response.status,
              message: error.response.data.error || 'Unknown server error',
              query: parameters,
            })
            throw new Error(
              `Server error (${error.response.status}): ${
                error.response.data.error || 'Unknown server error'
              }`
            )
        }
      } else if (error.request) {
        // Network error - no response received
        console.error('Network error: No response received from server')
        throw new Error(
          'Network error: Unable to reach paint server. Please check your connection and try again.'
        )
      } else {
        // Request setup error (rare)
        console.error('Request configuration error:', error.message)
        throw new Error(`Failed to make request: ${error.message}`)
      }
    }
  }
}

export default PaintApiService
