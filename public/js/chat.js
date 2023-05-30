import * as webRTC from "./webRTCHandler.js";
import { callType } from "./constants.js";
const socket = io();

const voice_call = document.getElementById("voice_call");
const video_call = document.getElementById("video_call");

voice_call.addEventListener("click", () => {
  console.log("voice call");
  const calleeCode = document.getElementById("personal_code_input").value;
  const type = callType.CHAT_PERSONAL_CODE;
  const data = webRTC.sendPreOffer(type, calleeCode);
  socket.emit("pre-offer", data);
});

video_call.addEventListener("click", () => {
  console.log("video call");
  const calleeCode = document.getElementById("personal_code_input").value;
  const type = callType.VIDEO_PERSONAL_CODE;
  const data = webRTC.sendPreOffer(type, calleeCode);
  socket.emit("pre-offer", data);
});

socket.on("pre-offser", (data) => {
  console.log("first");
  webRTC.handlePreOffer(data);
});
