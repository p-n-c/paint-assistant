import http from 'http'
import url from 'url'

const PORT = 3000
const ENDPOINT = `http://localhost:${PORT}/`
const QS_KEY = 'qs'

const colours = [
  {
    name: 'red',
    hex: '#ff0000',
  },
  {
    name: 'green',
    hex: '#008000',
  },
  {
    name: 'blue',
    hex: '#0000ff',
  },
  {
    name: 'white',
    hex: '#ffffff ',
  },
]

const statusCodes = [
  200, // default (success)
  404, // not found
]

const config = {
  headers: [
    {
      name: 'Access-Control-Allow-Origin',
      value: '*',
    },
    {
      name: 'Content-Type',
      value: 'application/json',
    },
  ],
}

const server = http.createServer()

server.on('request', (req, res) => {
  // Set headers
  config.headers.forEach((header) => {
    res.setHeader(header.name, header.value)
  })

  // Get key value pairs from the query string
  const parsedUrl = url.parse(req.url, true)
  const queryAsObject = parsedUrl.query
  console.log('queryAsObject: ', queryAsObject)

  // Get first query string value
  const reqValue = queryAsObject[QS_KEY]
  console.log('reqValue: ', reqValue)

  let resValue

  // Look up return value for query string value
  resValue =
    colours.find((c) => c.name.toLowerCase() === reqValue?.toLowerCase())
      ?.hex || null

  // Return all colours if no query string
  if (Object.keys(queryAsObject).length === 0) resValue = colours

  console.log('resValue: ', resValue)

  res.statusCode = resValue ? statusCodes[0] : statusCodes[1]

  // Return request response
  res.end(JSON.stringify(resValue))
})

server.listen(PORT, () => {
  console.log(`Server running at ${ENDPOINT}`)
})
