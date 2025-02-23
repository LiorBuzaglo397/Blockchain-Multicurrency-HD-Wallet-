import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useUser();
  const navigate = useNavigate();

  function handleLogin(event) {
    event.preventDefault();

    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const userWallet = allUsers.find((user) => user.username === username && user.password === password);

    if (!userWallet) {
      alert("Invalid username or password!");
      return;
    }

    userWallet.isLoggedIn = true;
    localStorage.setItem("currentUser", JSON.stringify(userWallet));

    login(userWallet);
    navigate("/wallet");
  }

  return (
    <main className="login-container">
      <h1>Login to Your Wallet</h1>
      <form onSubmit={handleLogin}>
        <label htmlFor="loginUsername">Username</label>
        <input type="text" id="loginUsername" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <label htmlFor="loginPassword">Password</label>
        <input type="password" id="loginPassword" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
        <p>Don't have a wallet? <a href="/create-wallet">Create Wallet</a></p>
        <p>or <a href="/restore-account">Restore Wallet</a></p>
      </form>
    </main>
  );
}

export default Login;
