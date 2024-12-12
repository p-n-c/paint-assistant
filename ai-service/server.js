import express from 'express'
import dotenv from 'dotenv'
import { handleQuery } from './handlers/query.js'

dotenv.config()
const app = express()
const PORT = 3001

app.use(express.json())

// Main query endpoint
app.post('/query', handleQuery)

app.listen(PORT, () => {
  console.log(`AI Service running at http://localhost:${PORT}`)
})