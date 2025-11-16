import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import duelSocketHandler from "./sockets/duelSocket.js";

const PORT = process.env.PORT || 4000;
connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Initialize duel socket logic
io.on("connection", (socket) => {
  //console.log(socket);
  
  duelSocketHandler(io, socket);
});


server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
