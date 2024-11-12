import http from 'http'
import url from 'url'
import { colours } from './utils.js'

const PORT = 3000
const ENDPOINT = `http://localhost:${PORT}/`

const server = http.createServer()

const handleGetRequest = (req, res) => {
  // Set headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')

  // Get key value pairs from the query string
  const parsedUrl = url.parse(req.url, true)
  const queryAsObject = parsedUrl.query

  // Get query string value
  const reqColour = queryAsObject['colour']

  // Look up return value for query string value
  let resColour =
    colours.find((c) => c.name.toLowerCase() === reqColour?.toLowerCase()) ||
    null

  // Return all colours if no colour specified
  if (Object.keys(queryAsObject).length === 0) resColour = colours

  res.statusCode = resColour ? 200 : 400

  // Return request response
  res.end(JSON.stringify(resColour))

  // Console log out
  console.log('Request for colour: ', reqColour)
  console.log('Response: ', JSON.stringify(resColour))
}

const handlePostRequest = (req, res) => {
  // Set headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  // res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  console.log('Request method: ', req.method)

  // Preflight request (browser generated)
  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  if (req.method === 'POST') {
    let data = ''

    req.on('data', (chunk) => {
      data += chunk.toString()
    })

    req.on('end', () => {
      try {
        const colour = JSON.parse(data)

        if (colours.map((hc) => hc.name).includes(colour.name)) {
          // Colour already exists
          res.writeHead(409)
          res.end(
            JSON.stringify({
              message: 'Colour already exists',
              colour,
            })
          )
        } else {
          colours.push(colour)

          // Console log out
          console.log('Colours: ', colours)

          // Send success response
          res.writeHead(201)
          res.end(
            JSON.stringify({
              message: 'Colour added successfully',
              colour,
            })
          )
        }
      } catch (e) {
        res.writeHead(400)
        res.end(
          JSON.stringify({
            error: 'Invalid JSON provided',
          })
        )
      }
    })
  }
}

server.on('request', async (req, res) => {
  if (req.method === 'GET') {
    handleGetRequest(req, res)
  } else if (req.url === '/post') {
    handlePostRequest(req, res)
  }
})

server.listen(PORT, () => {
  console.log(`Server running at: ${ENDPOINT}`)
})
