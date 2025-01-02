import { translateQuery, queryPaintApi } from './paint-query-handler.js'

export async function handleQuery(req, res) {
  try {
    const { query } = req.body

    // 1. Translate natural language to API parameters
    const apiParams = await translateQuery(query)

    // 2. Query Paint API with translated parameters
    const paintData = await queryPaintApi(apiParams)

    res.json({
      original_query: query,
      translated_params: apiParams,
      results: paintData,
    })
  } catch (error) {
    console.error('Query handling error:', error)
    res.status(500).json({
      error: 'Failed to process query',
      message: error.message,
    })
  }
}
