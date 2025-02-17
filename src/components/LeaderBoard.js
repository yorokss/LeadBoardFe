import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useLogout from "../api/auth"; 
import "../styles/Leaderboard.css"; 
const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const logout = useLogout();

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem("auth-token");
    setIsAuthenticated(!!token);

    if (!token) {
      setError("⚠️ You must be logged in to view the leaderboard.");
      setLoading(false);
      return;
    }

    const getLeaderboard = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/leaderboard", {
          headers: { "auth-token": token, "Content-Type": "application/json" },
        });

        if (response?.data?.data) {
          setLeaderboard(response.data.data);
        } else {
          setError("❌ Failed to load leaderboard.");
        }
      } catch (err) {
        setError("❌ Error fetching leaderboard. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getLeaderboard();
  }, []);

  return (
    <div className="leaderboard-container">
      {isAuthenticated && <button onClick={logout} className="logout-btn">🚪 Logout</button>}

      <h2 className="leaderboard-title">🏆 Leaderboard</h2>

      {error ? (
        <div className="error-container">
          <p className="error-text">{error}</p>
          <button onClick={() => navigate("/login")} className="button">🔐 Login</button>
        </div>
      ) : loading ? (
        <p>⏳ Loading leaderboard...</p>
      ) : leaderboard.length > 0 ? (
        <ul className="leaderboard-list">
          {leaderboard.map((entry, index) => (
            <li key={entry._id} className="leaderboard-item">
              <span>{index + 1}. {entry.userID?.name || "Unknown"}</span>
              <span className="leaderboard-score">{entry.score} pts</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No leaderboard data available.</p>
      )}

    
      {isAuthenticated && <button onClick={() => navigate("/submit")} className="button">➕ Add Score</button>}
    </div>
  );
};

export default Leaderboard;
