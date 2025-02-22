import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

function CreateWallet() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [wallet, setWallet] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // ✅ Generate a new Ethereum wallet
      const newWallet = ethers.Wallet.createRandom();
      const walletData = {
        username,
        password,
        address: newWallet.address,
        seedPhrase: newWallet.mnemonic.phrase,
        privateKey: newWallet.privateKey,
        isLoggedIn: true,
      };

      // ✅ Store wallet data in localStorage
      localStorage.setItem("userData", JSON.stringify(walletData));

      // ✅ Update state with wallet info
      setWallet(walletData);
    } catch (error) {
      setError("Wallet creation failed: " + error.message);
    }
  };

  // ✅ Navigate to the wallet page with user data
  const goToWallet = () => {
    if (wallet) {
      navigate("/wallet");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="shadow-lg p-4" style={{ width: "400px" }}>
        <h2 className="text-center text-primary">Create a New Wallet</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            Create Wallet
          </Button>
        </Form>

        {wallet && (
          <>
            <Alert variant="success" className="mt-3">
              <h5>Wallet Address:</h5>
              <p>{wallet.address}</p>
            </Alert>
            <Alert variant="info" className="mt-3">
              <h5>Seed Phrase (Write it Down!):</h5>
              <p>{wallet.seedPhrase}</p>
            </Alert>
            <Alert variant="warning" className="mt-3">
              <h5>Private Key (Keep it Safe!):</h5>
              <p>{wallet.privateKey}</p>
            </Alert>
            <Button variant="success" onClick={goToWallet} className="w-100 mt-3">
              Go to Wallet
            </Button>
          </>
        )}
      </Card>
    </Container>
  );
}

export default CreateWallet;
