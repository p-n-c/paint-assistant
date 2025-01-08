## Run the ICP canister and its front end locally

**IN WINDOWS, THIS SHOULD BE DONE IN THE WSL INSTANCE**

```bash
# Starts the ICP replica, running in the background with a clean slate
dfx start --background --clean

# Deploys your canisters to the replica and generates the interface to the backend canister
# Run again every time you make changes to the backend canister
dfx deploy

# Start the development server
npm start
```

The server will be located at `http://localhost:8080` (Ctrl/⌘ + Click) to open.

# Development notes

## ICP Blockchain canister

- **If in Windows, remember to run everything in a WSL instance, as `dfx` doesn't run natively**
- Don't even think about trying to develop your own Vanilla JS approach, links to the backend canister break
- Instead: `dfx new canister-name` with options `Motoko` and `VanillaJS` will provide all the scaffolding necessary for your peace of mind
- This creates a simple `vite` development server (you can change the port in the `start` script in `./src/translator-canister-frontend/package.json` )
