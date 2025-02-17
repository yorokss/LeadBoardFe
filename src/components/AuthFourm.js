import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import "../styles/AuthForm.css"; 

const AuthForm = ({ isSignup }) => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = isSignup
        ? "http://localhost:5000/api/auth/register" 
        : "http://localhost:5000/api/auth/login"; 

      const response = await axios.post(url, formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (isSignup) {
        setFormData({ name: "", email: "", password: "" }); 
        navigate("/login"); 
      } else {
        const { token, data } = response.data;
        
        localStorage.setItem("auth-token", token); 
        localStorage.setItem("user", JSON.stringify(data));

        setFormData({ email: "", password: "" }); 
        navigate("/leaderboard"); 
      }
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed. Try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">{isSignup ? "Create an Account" : "Welcome Back"}</h2>
      {error && <p className="auth-error">{error}</p>}
      
      <form className="auth-form" onSubmit={handleSubmit}>
        {isSignup && (
          <input 
            type="text" 
            name="name" 
            placeholder="Full Name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            className="auth-input"
          />
        )}
        <input 
          type="email" 
          name="email" 
          placeholder="Email Address" 
          value={formData.email} 
          onChange={handleChange} 
          required 
          className="auth-input"
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          value={formData.password} 
          onChange={handleChange} 
          required 
          className="auth-input"
        />
        <button type="submit" className="auth-button">{isSignup ? "Register" : "Login"}</button>
      </form>

      {/* Navigation Buttons */}
      <div className="auth-actions">
        <button onClick={() => navigate("/leaderboard")} className="nav-button">🏆 View Leaderboard</button>
        <button onClick={() => navigate("/submit")} className="nav-button">➕ Add Score</button>
      </div>

      {!isSignup && (
        <div className="switch-auth">
          <p>Don't have an account?</p>
          <button onClick={() => navigate("/signup")} className="register-button">Register</button>
        </div>
      )}
      
      {isSignup && (
        <div className="switch-auth">
          <p>Already have an account?</p>
          <button onClick={() => navigate("/login")} className="register-button">Login</button>
        </div>
      )}
    </div>
  );
};

export default AuthForm;
