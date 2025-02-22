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

    const userWallet = {
      username,
      password,
      address: generateWalletAddress(username), // יצירת כתובת מהשם
    };

    localStorage.setItem("userData", JSON.stringify(userWallet));
    login(userWallet);
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
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor="loginPassword">Password</label>
        <input
          type="password"
          id="loginPassword"
          value={password}
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

// ✅ פונקציה ליצירת כתובת (משתמשת בכתובת דמו קבועה)
const generateWalletAddress = (username) => {
  return "0xe3A2DF8A9b49485d6E3f3d66C87eD6C128D20DA7"; // כתובת לדוגמא
};

export default Login;
