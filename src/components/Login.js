import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useUser();
  const navigate = useNavigate();

  function handleLogin(event) {
    event.preventDefault();

    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const userWallet = allUsers.find((user) => user.username === username && user.password === password);

    if (!userWallet) {
      setError("Invalid username or password!");
      return;
    }

    userWallet.isLoggedIn = true;
    localStorage.setItem("currentUser", JSON.stringify(userWallet));

    login(userWallet);
    navigate("/wallet");
  }

  return (
    <div className="login-page">
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card className="p-4 login-card shadow-lg">
          <Card.Body>
            <h2 className="text-center text-primary mb-4">Login to Your Wallet</h2>

            {error && <Alert variant="danger" className="text-center">{error}</Alert>}

            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button type="submit" variant="success" className="w-100 py-2">
                Login
              </Button>
            </Form>

            <div className="text-center mt-3">
              <p>Don't have a wallet? <a href="#/create-wallet" className="text-primary">Create Wallet</a></p>
              <p>Forgot your wallet? <a href="#/restore-account" className="text-danger">Restore Wallet</a></p>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default Login;
