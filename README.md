# HTTP server

This is a simple HTTP server that has no dependencies, and runs in a node.js environment.

To run the server, run this command in the terminal:

`node src/server.js`

## Server process

When you want to shut down the service, run:

`Ctrl + c`

From time to time, you will find it necessary to terminate the server and end the current process.

This often happens when the following error message appears in the terminal:

`EADDRINUSE: address already in use`

Run:

`sudo lsof -i :3000`

Find the relevant (node) service, copy its PID, then enter:

`kill -9 <PID>`
