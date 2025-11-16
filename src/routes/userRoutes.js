import express from "express";
import { bindCodeforcesHandle, getMe, getByHandle, getMyDuels } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", authMiddleware, getMe);
router.post("/bind-handle", authMiddleware, bindCodeforcesHandle);

// FIX: PLACE DUELS HERE BEFORE :handle
router.get("/duels", authMiddleware, getMyDuels);

router.get("/:handle", getByHandle);

export default router;
