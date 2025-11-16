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

      setStatus("Searching for opponent...");
      s.emit("find_match", requestUser);
    });

    s.on("waiting", () => setStatus("Waiting for opponent..."));

    // When match is found
    s.on("match_found", ({ duel, opponent }) => {
      setStatus("Matched!");
      setMatchFound(true);
      setOpponent(opponent);
      setDuel(duel);
      setProblem(duel.problem);
    });

    // When duel ends
    // When duel ends
s.on("duel_finished", ({ winner, loser, ratingChanges }) => {
  const isWinner = winner === user.handle;

  const myRatingChange = isWinner
    ? ratingChanges[winner]
    : ratingChanges[loser];

  setStatus(
    isWinner
      ? `🎉 You WON! Rating +${myRatingChange}`
      : `😞 You LOST! Rating ${myRatingChange}`
  );

  // Update user rating in context
  user.rating = user.rating + myRatingChange;

  // Refresh page after 3 seconds
  setTimeout(() => window.location.reload(), 3000);
});


    s.on("connect_error", (err) => {
      setStatus("Connection Error: " + err.message);
    });
  };

  // cleanup
  useEffect(() => {
    return () => {
      if (socket) socket.disconnect();
    };
  }, [socket]);

  // ============================
  // UI SECTION
  // ============================
  return (
    <div style={{ padding: "20px" }}>
      <h1>Matchmaking</h1>

      {/* BEFORE MATCH FOUND */}
      {!matchFound && (
        <>
          <button onClick={startMatchmaking}>Start Matchmaking</button>
          <p>{status}</p>
        </>
      )}

      {/* AFTER MATCH FOUND */}
      {matchFound && opponent && (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            border: "1px solid #444",
            borderRadius: "10px",
            width: "350px",
          }}
        >
          <h2>Opponent Found</h2>

          <p>
            <strong>Opponent:</strong> {opponent.handle}
          </p>

          <p>
            <strong>Rating:</strong> {opponent.rating || "N/A"}
          </p>

          <h3>Problem Assigned:</h3>
          <p>
            <strong>{problem.title}</strong>
          </p>
          {console.log(problem)
          }
          <a
            href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "blue" }}
          >
            Open Problem
          </a>

          <div style={{ marginTop: "20px", color: "green" }}>
            <p>{status}</p>
          </div>
        </div>
      )}
    </div>
  );
}
