import User from "../models/User.js";
import Duel from "../models/Duel.js";
/**
 * GET /api/users/me
 * Returns the current authenticated user's profile
 */
export const getMe = async (req, res) => {
  try {
    const user = req.user;
    return res.json({
      handle: user.handle,
      rating: user.rating,
      wins: user.wins,
      losses: user.losses,
      email: user.email || null,
      avatar: user.avatar || null,
      codeforcesHandle: user.codeforcesHandle || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /api/users/bind-handle
 * Body: { codeforcesHandle: string }
 * Saves the user's Codeforces handle for tracking submissions
 */
export const bindCodeforcesHandle = async (req, res) => {
  try {
    const { codeforcesHandle } = req.body;
    if (!codeforcesHandle) return res.status(400).json({ message: "codeforcesHandle is required" });

    // ensure uniqueness of handle across users (optional)
    const exists = await User.findOne({ codeforcesHandle });
    if (exists && exists._id.toString() !== req.user._id.toString()) {
      return res.status(409).json({ message: "This Codeforces handle is already bound to another account" });
    }

    req.user.codeforcesHandle = codeforcesHandle;
    await req.user.save();
    return res.json({ message: "Codeforces handle saved", codeforcesHandle });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/users/:handle
 * Public: get basic profile by handle
 */
export const getByHandle = async (req, res) => {
  try {
    const { handle } = req.params;
    const user = await User.findOne({ handle }).select("-__v -googleId");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getMyDuels = async (req, res) => {
  try {
    const myHandle = req.user.handle;   // IMPORTANT

    const duels = await Duel.find({
      $or: [{ playerA: myHandle }, { playerB: myHandle }]
    }).sort({ createdAt: -1 });
//console.log(duels);

    res.json(duels);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
