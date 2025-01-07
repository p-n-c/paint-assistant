// import { translator_canister_backend } from '../../dclarations/translator-canister-backend'

const queryForm = document.getElementById('query-form')
const queryInput = document.getElementById('queryInput')
const responseDiv = document.getElementById('response')

queryForm.addEventListener('submit', async (e) => {
  e.preventDefault() // Prevent form from submitting traditionally

  const query = queryInput.value.toLowerCase().trim()

  if (!query) {
    responseDiv.innerHTML = 'Please enter a query'
    return
  }

  try {
    const result = query

    responseDiv.innerHTML = result
  } catch (error) {
    console.error('Error querying canister:', error)
    responseDiv.innerHTML = 'Error processing your query. Please try again.'
  }
})
