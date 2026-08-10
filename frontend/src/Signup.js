import "./Login.css";
import { useState } from "react";
import axios from "axios";

function Signup({ onBack, onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/signup/",
        {
          name: name,
          email: email,
          password: password,
        }
      );

      alert(response.data.message);

      // After successful signup, go to Login page
      onLogin();

    } catch (error) {
      console.error(error);

      if (error.response && error.response.data) {
        alert(error.response.data.error || "Signup failed");
      } else {
        alert("Unable to connect to the server");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <button className="back-button" onClick={onBack}>
          ← Back to ComplaintAI
        </button>

        <div className="login-logo">
          
        </div>

        <h1>Create Account</h1>

        <p className="login-subtitle">
          Join ComplaintAI and make civic reporting easier
        </p>

        <form onSubmit={handleSignup}>

          <div className="input-group">
            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>

            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>

          <button type="submit" className="login-button">
            Create Account →
          </button>

        </form>

        <div className="signup-section">
          <p>Already have an account?</p>

          <button
            className="create-account-button"
            onClick={onLogin}
          >
            ← Back to Login
          </button>
        </div>

      </div>
    </div>
  );
}

export default Signup;
