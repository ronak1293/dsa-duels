import { findMatch } from "../services/matchmakingService.js";
import { getUnsolvedProblem } from "../services/problemService.js";
import Duel from "../models/Duel.js";
import {monitorDuelWinner} from './duelMoniter.js'
export default (io, socket) => {
 socket.on("find_match", async (user) => {
  console.log("Incoming user:", user);

  // Wait for DB + matchmaking
  const match = await findMatch(user);

  if (!match) {
    socket.emit("waiting");
    return;
  }

  const { p1, p2 } = match;

  // Determine opponent
  const opponent = p1.handle === user.handle ? p2 : p1;

  if (!opponent) {
    console.log("Opponent missing. Match:", match);
    socket.emit("waiting");
    return;
  }

  console.log("Matched:", user.handle, "vs", opponent.handle);

  // Pick problem
  const problem = await getUnsolvedProblem(user.handle, opponent.handle);
  console.log(problem);
  

  if (!problem) {
    socket.emit("error", "No unsolved problems found!");
    return;
  }

  // Create duel entry
  const duel = await Duel.create({
    playerA: p1.handle,
    playerB: p2.handle,
    problem,
    startTime: new Date(),
    status: "active",
  });

  // Notify both
  io.to(p1.socketId).emit("match_found", { duel, opponent: p2 });
  io.to(p2.socketId).emit("match_found", { duel, opponent: p1 });

  // Start observing winner
  monitorDuelWinner(io, duel._id, {
  A: p1.handle,
  B: p2.handle,
  A_socket: p1.socketId,
  B_socket: p2.socketId,
  problem
});

});

};
