// duelMonitor.js
import axios from "axios";
import Duel from "../models/Duel.js";
import { finishDuelNode } from "../utils/finishDuelDirect.js";

const BASE_URL = "https://codeforces.com/api";

async function lastOK(handle, key) {
  try {
    const res = await axios.get(`${BASE_URL}/user.status`, { params: { handle } });

    if (res.data.status !== "OK") return null;

    return res.data.result.find(
      (sub) =>
        sub.verdict === "OK" &&
        `${sub.problem.contestId}-${sub.problem.index}` === key
    );
  } catch (err) {
    return null;
  }
}

export const checkWinner = async (A, B, problemKey) => {
  const subA = await lastOK(A, problemKey);
  const subB = await lastOK(B, problemKey);

  if (subA && !subB) return A;
  if (subB && !subA) return B;
  if (subA && subB) 
    return subA.creationTimeSeconds < subB.creationTimeSeconds ? A : B;

  return null;
};

export const monitorDuelWinner = (io, duelId, data) => {
  const { A, B, A_socket, B_socket, problem } = data;

  const problemKey = `${problem.contestId}-${problem.index}`;

  const interval = setInterval(async () => {
    try {
      const duel = await Duel.findById(duelId);
      if (!duel || duel.status === "finished") {
        clearInterval(interval);
        return;
      }

      const winner = await checkWinner(A, B, problemKey);
      if (!winner) return;

      clearInterval(interval);

      const loser = winner === A ? B : A;

      await finishDuelNode(duelId, winner);

      // Rating logic
      const ratingChanges = {
        [winner]: +20,
        [loser]: -20,
      };

      // Send results
      io.to(A_socket).emit("duel_finished", {
        winner,
        loser,
        ratingChanges,
      });

      io.to(B_socket).emit("duel_finished", {
        winner,
        loser,
        ratingChanges,
      });

      console.log("Duel finished. Winner:", winner);
    } catch (err) {
      console.log("Monitor error:", err);
    }
  }, 5000);
};
