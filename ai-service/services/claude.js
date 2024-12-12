import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config.js';

const anthropic = new Anthropic({
  apiKey: config.claudeApiKey,
});

// Prompt template to help Claude understand the task
const SYSTEM_PROMPT = `You are a paint expert API translator. You convert natural language queries about paint into API parameters.
Available API parameters:
- code: Exact paint code (e.g., 'AX-117-R')
- name: Paint name (e.g., 'Crimson Aurora')
- temperature: Find paints suitable for specific temperature
- voc: Find paints with VOC lower than specified value

Return only the API parameters as a JSON object. For example:
"I need paint for hot weather around 35 degrees" -> { "temperature": 35 }
"Show me low VOC paints under 40" -> { "voc": 40 }`;

export async function translateQuery(query) {
  try {
    const message = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 150,
      temperature: 0.0,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Translate this paint query to API parameters: "${query}"`
        }
      ]
    });

    // Parse Claude's response into API parameters
    const parameters = JSON.parse(message.content[0].text);
    return parameters;

  } catch (error) {
    console.error('Claude API error:', error);
    throw new Error('Failed to translate query');
  }
}