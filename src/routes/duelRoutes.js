import express from "express";
import {
  getDuelById,
  getMyHistory,
  getLeaderboard,
  finishDuel,
} from "../controllers/duelController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public leaderboard
router.get("/leaderboard", getLeaderboard);

// Get duel by id (protected)
router.get("/:id", authMiddleware, getDuelById);

// Finish duel (protected — backend uses this after CF detection)
router.post("/finish", authMiddleware, finishDuel);

// Duel history of logged-in user
router.get("/history/me", authMiddleware, getMyHistory);

export default router;
