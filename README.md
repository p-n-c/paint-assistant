# Paint Query System with Internet Computer Integration

## System Overview

This project demonstrates a hybrid system that combines AI-powered natural language processing with blockchain-based caching using the Internet Computer Protocol (ICP). The system translates natural language queries about paint properties into structured API calls, with translations cached on the blockchain for efficiency.

### Architecture Flow

1. **User Query**: A user submits a natural language question about paint (e.g., "What paints work at 40 degrees?"). The user can query against:

   - the name of the paint (TODO: test)
   - the code of the paint
   - the temperature of use
   - the maximum VOC content

2. **Translation Layer**:

   - The system first checks if this query has been translated before by consulting the ICP canister (TODO: fuzzy check, right now it's a strict equality check)
   - If not found, Claude AI translates the natural query into structured API parameters
   - The translation is stored in the blockchain cache for future use

3. **Paint API**:
   - The structured query is sent to the Paint Data API
   - The API returns matching paint products
   - Results are cached along with the translation

### Key Components

#### Client-Side Components

- `ai-paint-query/`: Main directory for the query translation system
  - `services/paint-query-handler.js`: Manages the AI translation process using Claude
  - `services/canister-interface.js`: Handles communication with the ICP canister
  - `config/config.js`: Configuration settings for APIs and services
  - `test-paint-system.js`: Test harness demonstrating the complete flow

#### Paint API Components

- `paint-api/`: Directory containing the paint data service
  - `server.js`: RESTful API server handling paint queries
  - `paint-data.js`: Paint product database

## Getting Started

### Prerequisites

1. Node.js and npm installed
2. Internet Computer SDK (dfx) installed
3. A local IC network connection
4. Claude API key for AI translation

### Environment Setup

Create a `.env` file in the project root. You can copy the `.env.example` and add your own Claude API key:

```env
CLAUDE_API_KEY=your_api_key_here
PAINT_TRANSLATOR_CANISTER_ID=bkyz2-fmaaa-aaaaa-qaaaq-cai
IC_HOST=http://127.0.0.1:4943
IC_LOCAL=true
```

### Running the System

0. Clone the IC replica from https://github.com/p-n-c/ICP-Paint-translator.git

1. Start the local IC replica:

   ```bash
   cd ICP-Paint-translator
   dfx start --background
   ```

2. Deploy the canister:

   ```bash
   dfx deploy
   ```

3. Start the Paint API server:

   ```bash
   cd paint-api
   npm install
   node server.js
   ```

4. Run the query system:
   ```bash
   cd ai-paint-query
   npm install
   node test-paint-system.js
   ```

## How It Works

### Query Processing Flow

1. When a natural language query is received, the system first checks the ICP canister's cache through `canister-interface.js`

2. If the query hasn't been seen before:

   - `paint-query-handler.js` uses Claude AI to translate it into API parameters
   - The translation is stored in the ICP canister for future use
   - The Paint API is queried with the translated parameters

3. If the query exists in the cache:
   - The system retrieves the cached translation and API response
   - This saves processing time and AI API calls

**Note**: Currently, the ICP canister is cleared at every run of the test script.

### Internet Computer Integration

The system uses an ICP canister (smart contract) to:

- Store query translations persistently on the blockchain
- Provide fast access to previously processed queries
- Ensure consistency across different users and sessions

The canister interface is defined in `canister-interface.js`, which handles all communication with the ICP blockchain using the Internet Computer's agent-js library.

TODO: More relevant uses of the smart contract

## Testing

The `test-paint-system.js` script demonstrates the complete flow with sample queries. It includes examples of:

- First-time query processing
- Cache hit scenarios
- Error handling

Run the tests to see the system in action:

```bash
node test-paint-system.js
```

## Common Issues and Troubleshooting

1. If the canister ID is not found:

   - Ensure you've deployed the canister using `dfx deploy`
   - Check the canister ID with `dfx canister id paint_translator_backend`
   - Check that the canister ID is correctly set in your `.env` file

2. If Claude API calls fail:

   - Verify your API key is correct
   - Check your network connection
   - Ensure you're not exceeding API rate limits

3. If the Paint API is unreachable:
   - Confirm the server is running on port 3000
   - Check for any firewall issues
   - Verify the API URL in your config
   - Check the server output on the terminal
