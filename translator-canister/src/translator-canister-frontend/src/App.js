import { translator_canister_backend } from 'declarations/translator-canister-backend'

class App {
  constructor() {
    // Initialize class properties
    this.canisterApi = null

    // Bind methods to maintain correct 'this' context
    this.handleSubmit = this.handleSubmit.bind(this)
    this.setupCanisterApi = this.setupCanisterApi.bind(this)
    this.initialize = this.initialize.bind(this)

    // Initialize the application
    this.initialize()
  }

  // Initialize the application
  async initialize() {
    try {
      // Set up the canister API
      await this.setupCanisterApi()

      // Set the logo source
      const logoElement = document.getElementById('logo')
      if (logoElement) {
        logoElement.src = logo
      }

      // Attach event listeners
      this.attachEventListeners()
    } catch (error) {
      console.error('Failed to initialize app:', error)
      this.showError('Failed to initialize application')
    }
  }

  // Set up the canister API connection
  async setupCanisterApi() {
    try {
      this.canisterApi = {
        checkCache: translator_canister_backend.check_cache,
        clearCache: translator_canister_backend.clear_cache,
        storeTranslation: translator_canister_backend.store_translation,
      }
    } catch (error) {
      console.error('Failed to initialize backend canister:', error)
      throw new Error('Canister initialization failed: ' + error.message)
    }
  }

  // Handle form submission
  async handleSubmit(event) {
    event.preventDefault()

    const queryInput = document.getElementById('queryInput')
    const responseDiv = document.getElementById('response')

    const query = queryInput.value.trim().toLowerCase()
    if (!query) {
      this.showError('Please enter a query')
      return
    }

    try {
      const cached = await this.canisterApi.checkCache(query)
      let replyHtml = `<p>Natural language query: ${query}</p>`
      if (cached.length > 0) {
        // Simply return the cached answer
        replyHtml += `<p>Found in cache:</p><p>${JSON.stringify(cached)}<p>`
      } else {
        replyHtml += `<p>Not found in cache - Querying API</p>`
      }

      // Update response content
      responseDiv.style.color = ''
      responseDiv.innerHTML = replyHtml
    } catch (error) {
      console.error('Error querying canister:', error)
      this.showError('Error processing your query. Please try again.')
    }
  }

  // Display error messages
  showError(message) {
    const responseDiv = document.getElementById('response')
    responseDiv.textContent = message
    responseDiv.style.color = 'red'
  }

  // Attach event listeners
  attachEventListeners() {
    const form = document.getElementById('query-form')
    if (form) {
      form.addEventListener('submit', this.handleSubmit)
    }
  }
}

export default App
