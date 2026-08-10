import "./Login.css";
import { useState } from "react";
import axios from "axios";

function Login({ onBack, onSignup, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/login/",
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        }
      );

      console.log("LOGIN RESPONSE:", response.data);

      alert("Login successful!");

      console.log("Logged in user:", response.data.user);

      onLoginSuccess(response.data.user);
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      if (error.response) {
        alert(
          error.response.data.error ||
            "Invalid email or password."
        );
      } else {
        alert("Cannot connect to backend.");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <button className="back-button" onClick={onBack}>
          ← Back to ComplaintAI
        </button>

        <div className="login-logo"></div>

        <h1>Welcome Back!</h1>

        <p className="login-subtitle">
          Login to your ComplaintAI account
        </p>

        <form onSubmit={handleLogin}>

          <div className="login-input-group">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-input-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="login-options">
            <label>
              <input type="checkbox" />
              Remember me
            </label>

            <button
              type="button"
              className="forgot-password"
              onClick={() =>
                alert("Password reset will be added soon.")
              }
            >
              Forgot Password?
            </button>
          </div>

          <button type="submit" className="login-submit">
            Login
          </button>

        </form>

        <div className="login-divider">
          <span>OR</span>
        </div>

        <p className="signup-text">
          Don't have an account?
        </p>

        <button
          className="signup-button"
          onClick={onSignup}
        >
          Create an Account →
        </button>

      </div>
    </div>
  );
}

export default Login;

