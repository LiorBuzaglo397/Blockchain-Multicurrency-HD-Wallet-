import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Wallet from "./components/Wallet";
import SendCoins from "./components/SendCoins";
import TransactionHistory from "./components/TransactionHistory";
import CreateWallet from "./components/CreateWallet";
import RestoreAccount from "./components/RestoreAccount"; 

function App() {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/create-wallet" element={<CreateWallet />} />
        <Route path="/restore-account" element={<RestoreAccount />} />
        <Route path="/send-coins" element={<SendCoins />} />
        <Route path="/transaction-history" element={<TransactionHistory />} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
