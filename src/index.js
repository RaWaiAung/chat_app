const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.port || 4000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

// server(emit) -> client (receive) - countUpdated
// client(emit) -> server (receive) - increment

let count = 0;
io.on("connection", (socket) => {
  console.log("New Websocket connection");
  socket.emit("message", "Welcome !");
  socket.on("sendMessage", (message) => {
    io.emit("message", message);
  });
});
server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
