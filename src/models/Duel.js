import mongoose from "mongoose";

const duelSchema = new mongoose.Schema({
  playerA: { type: String, required: true },
  playerB: { type: String, required: true },
  problem: {
    contestId: Number,
    index: String,
    name: String,
    rating: Number,
  },
  startTime: Date,
  endTime: Date,
  winner: { type: String, default: null },
  status: { type: String, default: "pending" }, // pending, active, finished
});

export default mongoose.model("Duel", duelSchema);
