import User from "../models/User.js";

let waitingPlayers = [];
const RATING_TOLERANCE = 200;

export const findMatch = async (player) => {
  // 1️⃣ Fetch full user data from DB
  const dbUser = await User.findOne({ handle: player.handle }).lean();

  if (!dbUser) {
    console.log("User not found in DB:", player.handle);
    return null;
  }

  // Merge DB fields + socketId
  const fullPlayer = {
    handle: dbUser.handle,
    socketId: player.socketId,
    rating: dbUser.rating,
    wins: dbUser.wins,
    losses: dbUser.losses,
    joinedAt: Date.now(),
  };

  // 2️⃣ Remove old entry (avoid duplicate)
  waitingPlayers = waitingPlayers.filter(p => p.handle !== fullPlayer.handle);

  // 3️⃣ Push updated player
  waitingPlayers.push(fullPlayer);

  console.log("Queue:", waitingPlayers);

  // 4️⃣ Sort by rating
  waitingPlayers.sort((a, b) => a.rating - b.rating);

  // 5️⃣ Try matching
  for (let i = 0; i < waitingPlayers.length - 1; i++) {
    let p1 = waitingPlayers[i];
    let p2 = waitingPlayers[i + 1];

    if (Math.abs(p1.rating - p2.rating) <= RATING_TOLERANCE) {
      waitingPlayers.splice(i, 2);
      return { p1, p2 };
    }
  }

  return null;
};
