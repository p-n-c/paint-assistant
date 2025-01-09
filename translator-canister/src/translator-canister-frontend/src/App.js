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
      this.initElement(responseDiv)
      this.addUpdate(responseDiv, `Natural language query: ${query}`)
      if (cached.length > 0) {
        // Simply return the cached answer
        this.addUpdate(responseDiv, 'Found in cache:')
        this.addUpdate(responseDiv, `${JSON.stringify(cached)}`)
      } else {
        this.addUpdate(responseDiv, 'Not found in cache - Querying API')
      }
    } catch (error) {
      console.error('Error querying canister:', error)
      this.showError('Error processing your query. Please try again.')
    }
  }

  // Init the response element
  initElement(element) {
    element.style.color = ''
    element.innerHTML = ''
  }

  // Incremental message update
  addUpdate(element, message) {
    const updateElement = document.createElement('div')
    updateElement.className = 'update'
    updateElement.textContent = message
    element.appendChild(updateElement)
    // Auto-scroll to the bottom to show new updates
    element.scrollTop = element.scrollHeight
  }

  // Display error messages
  showError(element, message) {
    element.style.color = 'red'
    this.addUpdate(element, message)
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
