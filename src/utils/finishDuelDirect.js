import Duel from "../models/Duel.js";
import User from "../models/User.js";
import { updateElo } from "./elo.js";

export const finishDuelNode = async (duelId, winnerHandle) => {
  const duel = await Duel.findById(duelId);
  if (!duel) return;

  duel.winner = winnerHandle;
  duel.status = "finished";
  await duel.save();

  // update ratings
  const userA = await User.findOne({ handle: duel.playerA });
  const userB = await User.findOne({ handle: duel.playerB });

  const Ra = userA.rating;
  const Rb = userB.rating;

  const resultA = winnerHandle === duel.playerA ? 1 : 0;
  const resultB = 1 - resultA;

  const [newRa, newRb] = updateElo(Ra, Rb, resultA, resultB);

  userA.rating = Math.round(newRa);
  userB.rating = Math.round(newRb);

  if (resultA === 1) userA.wins++; else userA.losses++;
  if (resultB === 1) userB.wins++; else userB.losses++;

  await userA.save();
  await userB.save();
};
