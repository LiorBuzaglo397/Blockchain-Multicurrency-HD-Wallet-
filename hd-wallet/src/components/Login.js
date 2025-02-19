import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleLogin(event) {
    event.preventDefault();
    
    // כאן נשמור את המשתמש ב-localStorage לדמות אימות
    localStorage.setItem("user", JSON.stringify({ username, password }));

    // נוודא שהמשתמש מועבר לדף Wallet
    navigate("/wallet");
  }

  return (
    <main className="login-container">
      <h1>Login to Your Wallet</h1>
      <form onSubmit={handleLogin}>
        <label htmlFor="loginUsername">Username</label>
        <input
          type="text"
          id="loginUsername"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor="loginPassword">Password</label>
        <input
          type="password"
          id="loginPassword"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <p>Don't have a wallet? <a href="/create-wallet">Create Wallet</a></p>
        <p>or <a href="/restore-account">Restore Wallet</a></p>
      </form>
    </main>
  );
}

export default Login;
