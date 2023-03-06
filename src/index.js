const express = require("express");
const http = require("http");
const path = require("path");
const Filter = require("bad-words");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.port || 5000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

// server(emit) -> client (receive) - countUpdated
// client(emit) -> server (receive) - increment

let count = 0;
io.on("connection", (socket) => {
  console.log("New Websocket connection");

  socket.emit("message", "Welcome !");
  socket.broadcast.emit("message", "A new user joined !");

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed");
    }
    io.emit("message", message);
    callback();
  });
  socket.on("sendLocation", (coords, callback) => {
    io.emit(
      "message",
      `https://google.com/maps?q=${coords.latitube},${coords.longitube}`
    );
    callback();
  });
  socket.on("disconnect", () => {
    io.emit("message", "A user has left!");
  });
});
server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
