import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

const PORT = process.env.PORT || 3000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  serveClient: false,
});

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  socket.on("message", (msg) => {
    io.emit("message", msg);
    console.log("message: " + msg);
  });
});

server.listen(PORT, () => {
  console.log("server listening on port " + PORT);
});
