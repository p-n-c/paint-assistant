import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import { handleQuery } from './handlers/query.js'

const app = express()
const PORT = 3001

app.use(express.json())

// Main query endpoint
app.post('/query', handleQuery)

app.listen(PORT, () => {
  console.log(`AI Service running at http://localhost:${PORT}`)
})