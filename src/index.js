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
const users = [];
io.on("connection", (socket) => {
  console.log("New Websocket connection");
  socket.emit("countUpdated", count);
  socket.on("increment", () => {
    count++;
    // socket.emit("countUpdated", count);
    io.emit("countUpdated", count);
  });

  socket.on("hello", (count1, cb) => {
    console.log(count1);
    io.emit("countUpdated1", count1);
    cb({
      status: "ok",
    });
  });

  // socket.on("room", (room) => {
  //   console.log(room);
  //   socket.join(room);
  //   io.to(room).emit("message", "what is going on");
  // });

  socket.on("room", ({ username, room }) => {
    const user = {
      name: username,
      room,
    };

    socket.join(user.room);

    io.to(room).emit("message", {
      text: `${user.name}, Welcome to ${user.room} room.`,
    });

    socket.broadcast.to(user.room).emit("join", {
      join: `${user.name.toUpperCase()} has joined!`,
    });
  });

  socket.on("user_connected", (username) => {
    users[username] = socket.id;
    io.emit("user_connected", username);
  });

  socket.on("sendMessage", (data) => {
    console.log(data);
  });
});
server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
