# HTTP Paint server

Located in `./paint-api`

This is a simple HTTP server that exposes a basic API to query a `paints` array stored in `paint-data.js`. 
To start the server, run this command in a terminal open in `./paint-api`:

`npm start`

The server is running on `http://localhost:3000/` and expects queries for one of the following parameters (at the moment, only one):
- Paint code: `code`
- Paint name: `name`
- Temperature of use: `temperature`
- VOC content: `voc`

Returns an array of suitable paint objects or a 404 Error if no suitable paint is available.

# HTTP AI server

Located in `./ai-service`





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
