import { io } from "socket.io-client";

let socketInstance = null;

export default function duelSocket(token) {
  if (!socketInstance) {
    socketInstance = io("http://localhost:4000", {
      auth: { token },          
      transports: ["websocket"],
      reconnection: true,
    });
  }

  return socketInstance;
}
