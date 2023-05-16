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
const messages = [];
const rooms = [];
const addUser = (username, socketId) => {
  users.push({ username, socketId });
};

const getUser = (username) => {
  return users.find((user) => user.username === username);
};

const currendUser = (socketId) => {
  return users.find((user) => user.socketId === socketId);
};

io.on("connection", (socket) => {
  console.log("New Websocket connection", socket.id);
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

  socket.on("room", ({ username, roomID, peerID }) => {
    console.log("text", {
      username,
      roomID,
      peerID,
    });
    const user = {
      name: username,
      roomID,
      peerID,
    };
    console.log(user);
    rooms[roomID] = peerID;
    console.log(rooms[roomID]);
    socket.join(user.roomID);

    io.to(user.roomID).emit("message", {
      text: `${user.name}, Welcome to ${user.room} room.`,
    });

    socket.broadcast.to(user.roomID).emit("join", {
      join: `${user.name.toUpperCase()} has joined!`,
    });
  });

  socket.on("create_room", () => {
    const roomID = Math.random().toString().substring(2, 8);

    socket.join(roomID);
    socket.emit("room-created", { roomID });
  });

  socket.on("user_connected", (username) => {
    // users[username] = socket.id;
    addUser(username, socket.id);
    io.emit("user_connected", username);
  });

  socket.on("sendMessage", (data) => {
    const { message, receiver } = data;
    const receiveUser = getUser(receiver);
    const sendUser = currendUser(socket.id);
    socket.to(receiveUser.socketId).emit("new_message", {
      message,
      sender: sendUser.username,
    });
    messages.push({ ...data });
    console.log("this is", receiveUser.socketId, sendUser.socketId);
  });

  // socket.on("disconnect", () => {
  //   let offlineUser = currendUser(socket.id);
  //   offlineUser = offlineUser.username;
  //   console.log("disconnect " + offlineUser);
  // });
});
server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
