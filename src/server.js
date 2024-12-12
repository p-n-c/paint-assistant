import http from 'http'
import url from 'url'
import { paints } from './paint-data.js'

const PORT = 3000
const ENDPOINT = `http://localhost:${PORT}/`

const server = http.createServer()

const handleGetRequest = (req, res) => {
  // Set headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')

  // Get query parameters
  const parsedUrl = url.parse(req.url, true)
  const query = parsedUrl.query

  // Initialize response
  let response = null
  let statusCode = 200

  try {
    // Return all paints if no query parameters
    if (Object.keys(query).length === 0) {
      response = paints
    }
    // Handle specific queries
    else {
      const { code, name, temperature, voc } = query

      if (code) {
        // Search by exact code match (case sensitive)
        response = paints.find((p) => p.code === code)
      } else if (name) {
        // Search by name (case insensitive)
        response = paints.find(
          (p) => p.name.toLowerCase() === name.toLowerCase()
        )
      } else if (temperature) {
        // Find paints suitable for a specific temperature
        const temp = parseFloat(temperature)
        response = paints.filter(
          (p) =>
            temp >= p.application.temperature.min &&
            temp <= p.application.temperature.max
        )
      } else if (voc) {
        // Find paints with VOC lower than specified
        const vocLimit = parseFloat(voc)
        response = paints.filter((p) => p.safety.VOC <= vocLimit)
      }

      // Set 404 if no matching paint found
      if (!response || (Array.isArray(response) && response.length === 0)) {
        statusCode = 404
        response = {
          error: 'No matching paints found',
          query: query,
        }
      }
    }

    // Log request details
    console.log('Request query:', query)
    console.log('Response status:', statusCode)

    // Send response
    res.statusCode = statusCode
    res.end(JSON.stringify(response))
  } catch (error) {
    // Handle errors
    console.error('Error processing request:', error)
    res.statusCode = 500
    res.end(
      JSON.stringify({
        error: 'Internal server error',
        message: error.message,
      })
    )
  }
}

server.on('request', async (req, res) => {
  if (req.method === 'GET') {
    handleGetRequest(req, res)
  } else {
    // Handle unsupported methods
    res.statusCode = 405
    res.end(
      JSON.stringify({
        error: 'Method not allowed',
        message: 'Only GET requests are supported',
      })
    )
  }
})

server.listen(PORT, () => {
  console.log(`Paint Server running at: ${ENDPOINT}`)
  console.log('Available query parameters: code, name, temperature, voc')
})
