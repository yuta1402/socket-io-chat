import io from "socket.io-client";
const socket = io();

const form = document.getElementById("message_form");
if (form !== null) {
  form.addEventListener("submit", () => {
    const input_msg = <HTMLInputElement>document.getElementById("input_msg");
    socket.emit("message", input_msg.value);
    input_msg.value = "";
  });
}

socket.on("message", (msg: string) => {
  const li = document.createElement("li");
  li.innerHTML = msg;

  console.log(msg);

  const list = document.getElementById("messages");
  if (list === null) {
    return;
  }

  list.appendChild(li);
});
