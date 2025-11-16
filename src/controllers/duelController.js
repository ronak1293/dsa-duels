import Duel from "../models/Duel.js";
import User from "../models/User.js";
import { updateElo } from "../utils/elo.js";

/**
 * GET /api/duels/:id
 */
export const getDuelById = async (req, res) => {
  try {
    const duel = await Duel.findById(req.params.id);
    if (!duel) return res.status(404).json({ message: "Duel not found" });
    return res.json(duel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * GET /api/duels/history/me
 */
export const getMyHistory = async (req, res) => {
  try {
    const handle = req.user.handle || req.user.codeforcesHandle;

    const duels = await Duel.find({
      $or: [{ playerA: handle }, { playerB: handle }],
    })
      .sort({ startTime: -1 })
      .limit(100);

    return res.json(duels);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * GET /api/duels/leaderboard
 */
export const getLeaderboard = async (req, res) => {
  try {
    const top = await User.find()
      .sort({ rating: -1 })
      .limit(100)
      .select("handle rating wins losses avatar");

    res.json(top);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * POST /api/duels/finish
 * Called by: duelMonitor when a CF user submits OK
 */
export const finishDuel = async (req, res) => {
  try {
    const { duelId, winnerHandle } = req.body;
    if (!duelId || !winnerHandle)
      return res.status(400).json({ message: "Missing fields" });

    const duel = await Duel.findById(duelId);
    if (!duel) return res.status(404).json({ message: "Duel not found" });
    if (duel.status === "finished")
      return res.status(400).json({ message: "Duel is already finished" });

    duel.winner = winnerHandle;
    duel.status = "finished";
    duel.endTime = new Date();

    await duel.save();

    // Update rating of both players
    const A = await User.findOne({ handle: duel.playerA });
    const B = await User.findOne({ handle: duel.playerB });

    if (A && B) {
      const Ra = A.rating || 1200;
      const Rb = B.rating || 1200;

      const resultA = winnerHandle === A.handle ? 1 : 0;
      const resultB = 1 - resultA;

      const [newRa, newRb] = updateElo(Ra, Rb, resultA, resultB);

      A.rating = Math.round(newRa);
      B.rating = Math.round(newRb);

      if (resultA === 1) A.wins++;
      else A.losses++;

      if (resultB === 1) B.wins++;
      else B.losses++;

      await A.save();
      await B.save();
    }

    return res.json({
      message: "Duel finished",
      duel,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
