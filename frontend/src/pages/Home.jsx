import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Home() {
  const [loading, setLoading] = useState(true);

  // simulate loading (remove if you have real loading)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-pulse space-y-4 w-64">
          <div className="h-8 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 animate-fadeIn">
        Welcome to 1v1 DSA Duel
      </h1>

      <p className="text-gray-600 text-lg md:text-xl mb-8 animate-fadeIn delay-150">
        Solve problems. Compete. Improve your rating.
      </p>

      <Link
        to="/login"
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-all transform hover:scale-105 animate-fadeIn delay-300"
      >
        Login to Start Competing
      </Link>
    </div>
  );
}
