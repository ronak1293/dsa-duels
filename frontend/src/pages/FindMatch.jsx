import { useState, useContext, useEffect } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "../context/AuthContext";

export default function FindMatch() {
  const { user, token } = useContext(AuthContext);

  const [socket, setSocket] = useState(null);
  const [status, setStatus] = useState("");
  const [matchFound, setMatchFound] = useState(false);

  const [opponent, setOpponent] = useState(null);
  const [duel, setDuel] = useState(null);
  const [problem, setProblem] = useState(null);

  const [finished, setFinished] = useState(null);

  const startMatchmaking = () => {
    if (!token) {
      setStatus("No token, please login again.");
      return;
    }

    const s = io("http://localhost:4000", {
      transports: ["websocket"],
      auth: { token },
    });

    setSocket(s);

    s.on("connect", () => {
      const requestUser = {
        handle: user.handle,
        socketId: s.id,
      };

      setStatus("Searching for an opponent…");
      s.emit("find_match", requestUser);
    });

    s.on("waiting", () => setStatus("Waiting for an opponent…"));

    // Match found
    s.on("match_found", ({ duel, opponent }) => {
      setStatus("Match Found!");
      setMatchFound(true);
      setOpponent(opponent);
      setDuel(duel);
      setProblem(duel.problem);
    });

    // Duel finished popup
    s.on("duel_finished", ({ winner, loser, ratingChanges }) => {
      const isWinner = winner === user.handle;

      const myRatingChange = isWinner
        ? ratingChanges[winner]
        : ratingChanges[loser];

      setFinished({
        result: isWinner ? "WIN" : "LOSS",
        message: isWinner
          ? `🎉 You WON! Rating +${myRatingChange}`
          : `😞 You LOST! Rating ${myRatingChange}`,
      });

      // update rating
      user.rating = user.rating + myRatingChange;

      setTimeout(() => window.location.reload(), 3000);
    });

    s.on("connect_error", (err) => {
      setStatus("Connection Error: " + err.message);
    });
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (socket) socket.disconnect();
    };
  }, [socket]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      
      {/* =======================
          BEFORE MATCH FOUND
      ======================= */}
      {!matchFound && !finished && (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Matchmaking</h1>

          <button
            onClick={startMatchmaking}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-lg font-semibold transition"
          >
            Start Matchmaking
          </button>

          {status && (
            <div className="mt-6 flex flex-col items-center">
              {/* Pulsing Searching Animation */}
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin my-4"></div>

              <p className="text-gray-300 animate-pulse text-lg">{status}</p>
            </div>
          )}
        </div>
      )}

      {/* =======================
          MATCH FOUND POPUP
      ======================= */}
      {matchFound && opponent && (
        <div className="bg-gray-800 w-full max-w-md p-6 rounded-2xl shadow-xl animate-[fadeIn_0.4s_ease] border border-gray-700">

          <h2 className="text-2xl font-bold text-green-400 mb-4 text-center">
            🎯 Match Found!
          </h2>

          <div className="space-y-3 text-gray-300">
            <p><strong className="text-white">Opponent:</strong> {opponent.handle}</p>
            <p><strong className="text-white">Rating:</strong> {opponent.rating || "N/A"}</p>

            <h3 className="text-xl font-semibold text-white mt-4">Problem Assigned</h3>
            <p className="text-lg font-semibold text-blue-300">{problem.title}</p>

            <a
              href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline hover:text-blue-300 transition"
            >
              Open Problem
            </a>

            <div className="mt-4 text-green-400 text-center font-semibold">
              {status}
            </div>
          </div>
        </div>
      )}

      {/* =======================
          DUEL FINISHED POPUP
      ======================= */}
      {finished && (
        <div className="fixed bottom-8 bg-gray-800 px-6 py-4 rounded-xl shadow-xl border border-gray-700 animate-[slideUp_0.4s_ease]">

          <p
            className={`text-2xl font-bold text-center ${
              finished.result === "WIN" ? "text-green-400" : "text-red-400"
            }`}
          >
            {finished.result === "WIN" ? "🏆 YOU WON!" : "💀 YOU LOST"}
          </p>

          <p className="text-gray-300 mt-2 text-center">{finished.message}</p>

        </div>
      )}
    </div>
  );
}
