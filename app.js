const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const responses = require("./responses.json");


const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files (like CSS) from the "public" directory
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("chat message", (msg) => {
    socket.broadcast.emit("chat message", msg); // This sends the message to everyone EXCEPT the original sender

    // Simulate a chatbot reply after a delay
    setTimeout(() => {
      const botReply = getBotReply(msg);
      socket.emit("chat message", botReply); // Reply only to the original sender
    }, 1000);
  });
});

function getBotReply(message) {
  const lowerCaseMessage = message.toLowerCase();
    for (let key in responses) {
        if (lowerCaseMessage.includes(key)) {
            return responses[key];
        }
    }
    return "Hmm, not quite sure about that one. Can you rephrase or ask something else?";
}

server.listen(3000, () => {
  console.log("listening on *:3000");
});


