// Necessary to use Axios to avoid CORS issues
import axios from 'axios'

class PaintApiService {
  constructor(baseUrl) {
    // Create an axios instance with default configuration
    this.api = axios.create({
      baseURL: baseUrl,
      // Adding default headers for JSON communication
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      // Adding timeout protection
      timeout: 10000, // 10 seconds
    })
  }

  async queryPaint(parameters) {
    try {
      // Using axios to make the request
      // Axios automatically handles query parameter serialization
      const response = await this.api.get('', {
        params: {
          type: parameters.type,
          value: parameters.value,
        },
      })

      // Axios puts the response data directly in the .data property
      return response.data
    } catch (error) {
      // Axios provides detailed error information
      if (error.response) {
        // The server responded with an error status
        console.error('Server error:', {
          status: error.response.status,
          data: error.response.data,
        })
        throw new Error(`Server error: ${error.response.status}`)
      } else if (error.request) {
        // The request was made but no response received
        console.error('Network error:', error.request)
        throw new Error('Network error: No response from server')
      } else {
        // Something else went wrong
        console.error('Error:', error.message)
        throw new Error(`Request failed: ${error.message}`)
      }
    }
  }
}

export default PaintApiService
