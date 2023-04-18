const socket = io();

socket.on("countUpdated", (count) => {
  console.log("The count updated occur", count);
});

socket.on("countUpdated1", (count1) => {
  console.log("The count1 updated occur", count1);
});

let count1 = 1;
let room = "abc";

socket.on("message", (data) => {
  const { text } = data;
  document.getElementById("welcome").innerHTML = text;
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
