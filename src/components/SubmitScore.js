import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useLogout from "../api/auth"; 
import "../styles/SubmitScore.css"; 

const SubmitScore = () => {
  const [score, setScore] = useState("");
  const [message, setMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const logout = useLogout();

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    setIsAuthenticated(!!token);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("auth-token");
    if (!token) {
      setMessage("⚠️ Please log in before submitting a score.");
      return;
    }

    const scoreValue = parseFloat(score);
    if (isNaN(scoreValue) || scoreValue <= 0) {
      setMessage("⚠️ Please enter a valid positive number.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/score", 
        { score: scoreValue.toFixed(2) },
        { headers: { "auth-token": token, "Content-Type": "application/json" } }
      );

      setMessage("✅ " + response.data.message);
      setScore("");
    } catch (error) {
      setMessage("❌ Failed to submit score. Try again later.");
    }
  };

  return (
    <div className="submit-container">
      {isAuthenticated ? (
        <button onClick={logout} className="logout-btn">🚪 Logout</button>
      ) : (
        <button onClick={() => navigate("/login")} className="login-btn">🔑 Login</button>
      )}

      <h2 className="submit-title">Submit Score</h2>
      {message && <p className={message.startsWith("✅") ? "success-text" : "error-text"}>{message}</p>}

      {isAuthenticated ? (
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            placeholder="Enter your score"
            required
            className="input"
          />
          <button type="submit" className="button">Submit Score</button>
        </form>
      ) : (
        <p className="error-text">⚠️ You must log in to submit a score.</p>
      )}

      {isAuthenticated ? (
        <button onClick={() => navigate("/leaderboard")} className="button">📊 View Leaderboard</button>
      ) : (
        <button onClick={() => navigate("/login")} className="button login-btn">🔑 Login</button>
      )}
    </div>
  );
};

export default SubmitScore;
