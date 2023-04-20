const socket = io();

socket.on("countUpdated", (count) => {
  console.log("The count updated occur", count);
});

socket.on("countUpdated1", (count1) => {
  console.log("The count1 updated occur", count1);
});

let count1 = 1;
let room = "abc";
var sender = "";
var receiver = "";
socket.on("message", (data) => {
  const { text } = data;
  document.getElementById("welcome").innerHTML = text;
});

var myForm = document.getElementById("myForm");
myForm.addEventListener("submit", (e) => {
  e.preventDefault();

  var user = document.getElementById("inp1").value;
  socket.emit("user_connected", user);
  sender = user;
  console.log("sender", sender);
});

socket.on("user_connected", (username) => {
  var html = "";
  html +=
    "<li><button onclick='selectedUser(this.innerHTML);'>" +
    username +
    "</button></li>";
  document.getElementById("list").innerHTML += html;
});
socket.on("join", (data) => {
  const { join } = data;
  document.getElementById("joined").innerHTML = join;
});
document.querySelector("#increment").addEventListener("click", () => {
  console.log("clicked");
  socket.emit("increment");
});

document.querySelector("#hello").addEventListener("click", () => {
  console.log("clicked1");
  socket.emit("hello", count1++, (res) => {
    console.log(res.status);
  });
});

document.querySelector("#join").addEventListener("click", () => {
  socket.emit("room", {
    username: "rawai",
    room: room,
  });
});

document.querySelector("#join1").addEventListener("click", () => {
  socket.emit("room", {
    username: "rawaiaung",
    room: room,
  });
});

var sendMessage = document.getElementById("sendMessage");
sendMessage.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = document.getElementById("inp2").value;
  socket.emit("sendMessage", {
    sender,
    receiver,
    message,
  });
});

function selectedUser(username) {
  receiver = username;
  console.log("receiver", receiver);
}
