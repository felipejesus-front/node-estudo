const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const users = [];
const socketId = [];

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  socket.on("new user", (userData) => {
    if (users.indexOf(userData.username) !== -1) {
      socket.emit("new user", { success: false });
    } else {
      users.push(userData);
      socketId.push(socket.id);
      socket.emit("new user", { success: true });
      //criar emmit with broadcast to all users about the new user online
    }
  });

  socket.on("chat message", (msg) => {
    if (
      users.indexOf(msg.username) !== -1 &&
      users.indexOf(msg.username) == socketId.indexOf(socket.id)
    ) {
      io.emit("chat message", msg);
    } else {
      console.log("Error: You have no permission to this action");
    }
  });

  socket.on("disconnect", () => {
    const id = socketId.indexOf(socket.id);
    socketId.splice(id, 1);
    users.splice(id, 1);
    console.log(socketId);
    console.log(users);
    console.log("user disconnected");
  });
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
