import { translator_canister_backend } from 'declarations/translator-canister-backend'
import TranslationService from './services/translationService'
import PaintApiService from './services/paintApiService'

class App {
  constructor() {
    // Initialize class properties
    this.canisterApi = null

    // Access document elements
    this.form = document.getElementById('query-form')
    this.queryInput = document.getElementById('queryInput')
    this.responseDiv = document.getElementById('response')
    this.clearButton = document.getElementById('clearCache')
    this.displayButton = document.getElementById('displayCache')

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
        getCache: translator_canister_backend.get_cache,
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
        // Makes sure it's an array - Thanks Claude :)
        const cachedResponse = JSON.parse(cached[0].api_response)
        this.addUpdate(
          this.responseDiv,
          this.formatPaintDetails(cachedResponse)
        )
      } else {
        this.addUpdate(this.responseDiv, 'Not found in cache - Querying API')
        const parameters = await this.translationService.translateQuery(query)
        this.addUpdate(this.responseDiv, `AI Translated query: ${parameters}`)
        this.addUpdate(this.responseDiv, 'Querying Paint API')
        const apiResponse = await this.paintApiService.queryPaint(parameters)
        await this.storeInCache(query, parameters, apiResponse)
        this.addUpdate(this.responseDiv, 'Storage done - API response:')
        this.addUpdate(this.responseDiv, this.formatPaintDetails(apiResponse))
      }
    } catch (error) {
      console.error('Error querying canister:', error)
      this.showError(
        this.responseDiv,
        'Error processing your query. Please try again.'
      )
    }
  }

  // Store the result in cache
  async storeInCache(naturalQuery, parameters, apiResponse) {
    try {
      const [queryType, queryValue] = Object.entries(parameters)[0]
      await this.canisterApi.storeTranslation(
        naturalQuery,
        JSON.stringify(queryType),
        JSON.stringify(queryValue),
        JSON.stringify(apiResponse)
      )
    } catch (error) {
      console.error('Failed to store translation:', error)
      throw new Error('Failed to store translation')
    }
  }

  // Display management
  // Init the response element
  initElement(element) {
    element.style.color = ''
    element.innerHTML = ''
  }
  // Incremental message update
  addUpdate(element, message, type = 'div') {
    const updateElement = document.createElement(type)
    updateElement.className = 'update'
    updateElement.innerHTML = message
    element.appendChild(updateElement)
    // Auto-scroll to the bottom to show new updates
    element.scrollTop = element.scrollHeight
  }
  // Display JSON
  formatPaintDetails(objectArray) {
    // Convert strings to objects if needed - First makes sure it's in an array
    const paints = []
      .concat(objectArray)
      .map((paint) => (typeof paint === 'string' ? JSON.parse(paint) : paint))

    // Create the HTML for each paint object
    if (paints.length > 0) {
      return paints
        .map(
          (paint) => `
          <details>
              <summary>${paint.name} (${paint.code})</summary>
              <pre>${JSON.stringify(paint, null, '| ')}</pre>
          </details>
      `
        )
        .join('\n')
    } else {
      return 'No paint found.'
    }
  }
  // Display error messages
  showError(element, message) {
    element.style.color = 'red'
    this.addUpdate(element, message)
  }

  // Attach event listeners
  attachEventListeners() {
    if (this.form) {
      this.form.addEventListener('submit', this.handleSubmit)
    }
    if (this.clearButton) {
      this.clearButton.addEventListener('click', async () => {
        this.initElement(this.responseDiv)
        this.addUpdate(this.responseDiv, 'Clearing cache')
        await this.canisterApi.clearCache()
        this.addUpdate(this.responseDiv, 'Cache cleared')
      })
    }
    if (this.displayButton) {
      this.displayButton.addEventListener('click', async () => {
        this.initElement(this.responseDiv)
        this.addUpdate(this.responseDiv, 'Getting cache')
        const cache = await this.canisterApi.getCache()
        if (cache.length > 0) {
          this.addUpdate(
            this.responseDiv,
            JSON.stringify(cache, null, '|'),
            'pre'
          )
        } else {
          this.addUpdate(this.responseDiv, 'Empty cache')
        }
      })
    }
  }
}

export default App
