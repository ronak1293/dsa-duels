import { useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function UserProfile() {
  const { user } = useContext(AuthContext);
  const [duels, setDuels] = useState([]);

  useEffect(() => {
    api.get("/user/duels").then(res => {
      setDuels(res.data)
    
    });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>{user.handle}'s Profile</h1>

      <p>Email: {user.email}</p>
      <p>Rating: {user.rating}</p>
      <p>Wins: {user.wins}</p>
      <p>Losses: {user.losses}</p>

      <h2>Match History</h2>
      {duels.length === 0 && <p>No duels played yet.</p>}

      {duels.map((d) => (
        <div key={d._id} style={{ marginBottom: "10px", padding: "10px", border: "1px solid #ddd" }}>
          <p>
            <strong>{d.playerA}</strong> vs <strong>{d.playerB}</strong>
          </p>
          <p>
            Winner: <b>{d.winner}</b>
          </p>
          <p>Date: {new Date(d.startTime).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
