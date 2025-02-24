import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { useUser } from "../UserContext";
import "./CreateWallet.css";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

function CreateWallet() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [walletData, setWalletData] = useState(null); 
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
    const newWalletData = {
      username,
      password,
      address: newWallet.address,
      seedPhrase: newWallet.mnemonic.phrase,
      privateKey: newWallet.privateKey,
      balance: "0.00",
      isLoggedIn: true,
    };

    existingUsers.push(newWalletData);
    localStorage.setItem("users", JSON.stringify(existingUsers));
    localStorage.setItem("currentUser", JSON.stringify(newWalletData));

    setWalletData(newWalletData); 
    login(newWalletData);
  }

  return (
    <Container className="mt-5">
      <Card className="shadow-lg p-4">
        <Card.Body>
          <h2 className="text-primary text-center mb-4">Create a New Wallet</h2>

          {!walletData ? (
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

              <Button type="submit" variant="success" className="w-100">
                Create Wallet
              </Button>
            </Form>
          ) : (
            <>
              <Alert variant="warning" className="text-center">
                <strong>⚠️ Important!</strong> Save your Seed Phrase securely.
                If you lose it, you won’t be able to recover your wallet!
              </Alert>

              <h4 className="text-success text-center mt-3">Wallet Created Successfully!</h4>

              <Card className="mt-3 p-3 bg-light">
                <h5 className="text-primary">Public Address:</h5>
                <p className="text-break">{walletData.address}</p>
              </Card>

              <Card className="mt-3 p-3 bg-light">
                <h5 className="text-danger">Private Key:</h5>
                <p className="text-break">{walletData.privateKey}</p>
              </Card>

              <Card className="mt-3 p-3 bg-light">
                <h5 className="text-warning">Seed Phrase:</h5>
                <p className="text-break">{walletData.seedPhrase}</p>
              </Card>

              <Button variant="primary" className="w-100 mt-3" onClick={() => navigate("/wallet")}>
                Go to Wallet
              </Button>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default CreateWallet;
