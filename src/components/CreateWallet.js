import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { useUser } from "../UserContext";
import "./CreateWallet.css";

function CreateWallet() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useUser();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

    if (existingUsers.some((user) => user.username === username)) {
      alert("Username already exists. Choose another one.");
      return;
    }

    const newWallet = ethers.Wallet.createRandom();
    const walletData = {
      username,
      password,
      address: newWallet.address,
      seedPhrase: newWallet.mnemonic.phrase,
      privateKey: newWallet.privateKey,
      balance: "0.00",
      isLoggedIn: true,
    };

    existingUsers.push(walletData);
    localStorage.setItem("users", JSON.stringify(existingUsers));
    localStorage.setItem("currentUser", JSON.stringify(walletData));

    login(walletData);
    navigate("/wallet");
  }

  return (
    <main className="wallet-container">
      <h1>Create a New Wallet</h1>
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Create Wallet</button>
      </form>
    </main>
  );
}

export default CreateWallet;
