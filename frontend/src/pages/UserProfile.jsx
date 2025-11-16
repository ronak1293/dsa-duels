import { useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function UserProfile() {
  const { user } = useContext(AuthContext);
  const [duels, setDuels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/user/duels").then((res) => {
      setDuels(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex justify-center">
      <div className="w-full max-w-3xl">

        {/* Profile Header */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-6">
          <h1 className="text-3xl font-bold mb-4">{user.handle}'s Profile</h1>

          <div className="space-y-2 text-gray-300">
            <p><span className="font-semibold text-white">Email:</span> {user.email}</p>
            <p><span className="font-semibold text-white">Rating:</span> {user.rating}</p>
            <p><span className="font-semibold text-white">Wins:</span> {user.wins}</p>
            <p><span className="font-semibold text-white">Losses:</span> {user.losses}</p>
          </div>
        </div>

        {/* Match History */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Match History</h2>

          {loading && (
            <div className="flex justify-center py-6">
              <div className="w-8 h-8 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {!loading && duels.length === 0 && (
            <p className="text-gray-400">No duels played yet.</p>
          )}

          <div className="space-y-4">
            {duels.map((d) => (
              <div
                key={d._id}
                className="bg-gray-700 p-4 rounded-lg shadow transition hover:bg-gray-600"
              >
                <p className="text-lg font-semibold mb-1">
                  <span className="text-blue-400">{d.playerA}</span> vs{" "}
                  <span className="text-red-400">{d.playerB}</span>
                </p>

                <p className="text-gray-300">
                  Winner:{" "}
                  <span className="font-bold text-green-400">{d.winner}</span>
                </p>

                <p className="text-gray-400 text-sm">
                  Date: {new Date(d.startTime).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
