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

let connectedPeers = [];

io.on("connection", (socket) => {
  console.log("New Websocket connection", socket.id);
  connectedPeers.push(socket.id);
  socket.on("pre-offer", (data) => {
    console.log("pre from chat");
    const { type, callPersonalCode } = data;
    console.log(callPersonalCode);
    const connectedPeer = connectedPeers.find(
      (peerSocketId) => peerSocketId === callPersonalCode
    );
    console.log("connect", connectedPeers);

    console.log("connect1", connectedPeer);
    if (connectedPeer) {
      const data = {
        callerSocketId: socket.id,
        callType: type,
      };
      console.log("send to client", data);
      io.to(callPersonalCode).emit("pre-offer", data);
    }
  });

  socket.on("disconnect", () => {
    const newConnectedPeers = connectedPeers.filter((peerSocketId) => {
      peerSocketId != socket.id;
    });

    connectedPeers = newConnectedPeers;
    console.log("user online", connectedPeers);
  });
});
server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
