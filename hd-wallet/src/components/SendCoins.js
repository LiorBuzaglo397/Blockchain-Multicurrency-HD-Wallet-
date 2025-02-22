import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendCoins } from "../mainsfuncs"; // ✅ Use sendCoins from mainsfuncs.js
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Card, Form, Button } from "react-bootstrap";
import CustomNavbar from "../components/Navbar"; // ✅ Import the Navbar component

function SendCoins() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [coin, setCoin] = useState("ETH");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function handleSend(event) {
    event.preventDefault();
    sendCoins(recipient, amount, coin, setMessage);
  }

  return (
    <div>
      {/* ✅ Custom Navbar */}
      <CustomNavbar />

      {/* Page Content with Top Padding to Prevent Navbar Overlap */}
      <Container className="mt-5 pt-5 d-flex justify-content-center">
        <Card className="shadow-lg p-4 w-100" style={{ maxWidth: "400px" }}>
          <Card.Body>
            <h3 className="text-primary text-center mb-4">Send Coins</h3>

            {/* ✅ Transaction Form */}
            <Form onSubmit={handleSend}>
              <Form.Group className="mb-3">
                <Form.Label>Recipient's Wallet ID</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter recipient address"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  step="any"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Coin</Form.Label>
                <Form.Select
                  value={coin}
                  onChange={(e) => setCoin(e.target.value)}
                  required
                >
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="AVAX">Avalanche (AVAX)</option>
                </Form.Select>
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100 mt-3">
                Send Coins
              </Button>
            </Form>

            {/* ✅ Transaction Message */}
            {message && (
              <div className="mt-3 text-center">
                <p className="fw-bold text-success">{message}</p>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default SendCoins;
