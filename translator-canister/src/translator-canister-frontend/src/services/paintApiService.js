// Necessary to use Axios to avoid CORS issues
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
      // The parameters come in as a string from Claude's translation
      // We need to parse it if it's a string
      const queryParams =
        typeof parameters === 'string' ? JSON.parse(parameters) : parameters

      // Now we can make the request with the properly formatted parameters
      const response = await this.api.get('', {
        params: queryParams,
      })

      return response.data
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.error || 'Server error'
        console.error('Server error:', {
          status: error.response.status,
          message: errorMessage,
          query: parameters,
        })
        throw new Error(
          `Server error (${error.response.status}): ${errorMessage}`
        )
      } else if (error.request) {
        console.error('Network error: No response from server')
        throw new Error('Network error: Unable to reach paint server')
      } else {
        console.error('Request setup error:', error.message)
        throw new Error(`Request failed: ${error.message}`)
      }
    }
  }
}

export default PaintApiService
