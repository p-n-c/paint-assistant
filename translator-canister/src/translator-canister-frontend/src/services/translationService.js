// src/services/translationService.js
import Anthropic from '@anthropic-ai/sdk'

// Define the system prompt that instructs Claude how to translate queries
const SYSTEM_PROMPT = `You are an export natural language to API translator. 
Convert natural language queries into API parameters according to the following contract. 
---
Single parameter query for a Paint Database API. 
Available API parameters: code, name, temperature, maxvoc
Return only JSON object. Example: "paint for 35 degrees" -> {"temperature": 35}
---`

class TranslationService {
  constructor(apiKey) {
    // Initialize the Anthropic client with your API key
    this.anthropic = new Anthropic({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
      // TODO Put the Claude Query in the back end for security
    })
  }

  async translateQuery(query) {
    try {
      // Create a message using Claude's API
      const message = await this.anthropic.messages.create({
        model: 'claude-3-sonnet-20240229', // Using the latest model
        max_tokens: 150, // Limiting response length since we just need the translation
        temperature: 0.0, // Using 0 temperature for consistent, deterministic responses
        system: SYSTEM_PROMPT, // Providing our system instructions
        messages: [
          {
            role: 'user',
            content: `Translate: "${query}"`,
          },
        ],
      })

      // Extract and parse the response
      // Claude will return a JSON string that we need to parse
      return message.content[0].text
    } catch (error) {
      // Provide detailed error information for debugging
      console.error('Translation error:', {
        message: error.message,
        type: error.type,
        query: query,
      })
      throw new Error(`Failed to translate query: ${error.message}`)
    }
  }
}

export default TranslationService
