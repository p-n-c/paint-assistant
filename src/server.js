import http from 'http'
import url from 'url'
import { statusCodes, hexColours, colours, colourise } from './utils.js'

const PORT = 3000
const ENDPOINT = `http://localhost:${PORT}/`
const KEY = 'colour'

const server = http.createServer()

const handleGetRequest = (req, res) => {
  // Set headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')

  // Get key value pairs from the query string
  const parsedUrl = url.parse(req.url, true)
  const queryAsObject = parsedUrl.query

  // Get first query string value
  const reqValue = queryAsObject[KEY]

  // Look up return value for query string value
  let resValue =
    hexColours.find((c) => c.name.toLowerCase() === reqValue?.toLowerCase())
      ?.hex || null

  // Return all hexColours if no query string
  if (Object.keys(queryAsObject).length === 0) resValue = hexColours

  res.statusCode = resValue ? statusCodes[0] : statusCodes[1]

  // Return request response
  res.end(JSON.stringify(resValue))

  // Console log out
  console.log(
    colourise(`queryAsObject: ${JSON.stringify(queryAsObject)}`, colours.yellow)
  )
  console.log(colourise(`reqValue: ${reqValue}`, colours.yellow))
  console.log(colourise(`resValue: ${resValue}`, colours.yellow))
}

const handlePostRequest = (req, res) => {
  // Set headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(204) // No content needed for OPTIONS
    res.end()
    return
  }

  console.log('req.method: ', req.method)

  if (req.method === 'POST') {
    let data = ''

    req.on('data', (chunk) => {
      // Append the chunk to the data variable
      data += chunk.toString()
    })

    console.log('data: ', data)

    req.on('end', () => {
      try {
        const hexColour = JSON.parse(data)
        console.log('hexColour: ', hexColour)
        // if (!hexColours.map((hc) => hc.name).includes(hexColour.name)) {
        hexColours.push(hexColour)
        // }

        // Console log out
        console.log('hexColours: ', hexColours)

        // Send success response
        res.writeHead(201, { 'Content-Type': 'application/json' })
        res.end(
          JSON.stringify({
            message: 'Colour added successfully',
            colour: hexColour,
          })
        )
      } catch (e) {
        console.log('e:', e)
        // Handle invalid JSON
        res.writeHead(400, { 'Content-Type': 'application/json' })
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
  console.log(`Server running at ${ENDPOINT}`)
})
