import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

function CreateWallet() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [accountAddress, setAccountAddress] = useState("");
  const [seedPhrase, setSeedPhrase] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Logout current user on page load
    const allUsers = JSON.parse(localStorage.getItem("userData")) || [];
    const loggedInUser = allUsers.find((user) => user.isLoggedIn);
    if (loggedInUser) {
      loggedInUser.isLoggedIn = false;
    }
    localStorage.setItem("userData", JSON.stringify(allUsers));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate wallet creation (replace with real Web3 logic)
    const newWalletAddress = "0x" + Math.random().toString(36).substr(2, 40);
    const newSeedPhrase = "random twelve word seed phrase";

    setAccountAddress(newWalletAddress);
    setSeedPhrase(newSeedPhrase);
    alert("Wallet created successfully!");
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="shadow-lg p-4" style={{ width: "400px" }}>
        <h2 className="text-center text-primary">Create a New Wallet</h2>
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

        <p className="text-center mt-3">
          Already have a wallet? <a href="/login">Login</a>
        </p>

        {accountAddress && (
          <Alert variant="success" className="mt-3">
            <h5>Wallet Address:</h5>
            <p>{accountAddress}</p>
          </Alert>
        )}

        {seedPhrase && (
          <Alert variant="info" className="mt-3">
            <h5>Seed Phrase:</h5>
            <p>{seedPhrase}</p>
          </Alert>
        )}

        <Button
          variant="outline-secondary"
          className="w-100 mt-3"
          onClick={() => navigate("/")}
        >
          Go To App
        </Button>
      </Card>
    </Container>
  );
}

export default CreateWallet;
