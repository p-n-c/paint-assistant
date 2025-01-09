import { translator_canister_backend } from 'declarations/translator-canister-backend'
import TranslationService from './services/translationService'
import PaintApiService from './services/paintApiService'

class App {
  constructor() {
    // Initialize class properties
    this.canisterApi = null

    // Access document elements
    this.queryInput = document.getElementById('queryInput')
    this.responseDiv = document.getElementById('response')

    // Initialize translation service
    this.translationService = new TranslationService(
      import.meta.env.VITE_CLAUDE_API_KEY
    )

    // Initialize the paint API service
    this.paintApiService = new PaintApiService(
      import.meta.env.VITE_PAINT_API_URL
    )

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
      this.showError(this.responseDiv, 'Failed to initialize application')
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

    const query = queryInput.value.trim().toLowerCase()
    if (!query) {
      this.showError(this.responseDiv, 'Please enter a query')
      return
    }

    try {
      const cached = await this.canisterApi.checkCache(query)
      this.initElement(this.responseDiv)
      this.addUpdate(this.responseDiv, `Natural language query: ${query}`)
      if (cached.length > 0) {
        // Simply return the cached answer
        this.addUpdate(this.responseDiv, 'Found in cache:')
        this.addUpdate(this.responseDiv, `${JSON.stringify(cached)}`)
      } else {
        this.addUpdate(this.responseDiv, 'Not found in cache - Querying API')
        const parameters = await this.translationService.translateQuery(query)
        this.addUpdate(this.responseDiv, `AI Translated query: ${parameters}`)
        this.addUpdate(this.responseDiv, 'Querying Paint API')
        const apiResponse = await this.paintApiService.queryPaint(parameters)
        this.addUpdate(this.responseDiv, 'API response:')
        this.addUpdate(this.responseDiv, JSON.stringify(apiResponse))
      }
    } catch (error) {
      console.error('Error querying canister:', error)
      this.showError(
        this.responseDiv,
        'Error processing your query. Please try again.'
      )
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
