import React, { useState } from "react";
import { sendCoins } from "../mainsfuncs"; 
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import CustomNavbar from "../components/Navbar";

function SendCoins() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [coin, setCoin] = useState("ETH"); // ✅ Default to "ETH"
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("🚀 Sending transaction...");

    try {
      if (!recipient || !amount || !coin) {
        throw new Error("❌ Please fill in all fields.");
      }
      await sendCoins(recipient, amount, coin, setMessage);
    } catch (error) {
      setMessage("❌ Transaction failed: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <CustomNavbar />
      <Container className="mt-5 pt-5 d-flex justify-content-center">
        <Card className="shadow-lg p-4 w-100" style={{ maxWidth: "400px" }}>
          <Card.Body>
            <h3 className="text-primary text-center mb-4">Send Coins</h3>

            {message && <Alert variant="info" className="text-center">{message}</Alert>}

            <Form onSubmit={handleSend}>
              <Form.Group className="mb-3">
                <Form.Label>Recipient's Wallet Address</Form.Label>
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
                <Form.Label>Select Coin</Form.Label>
                <Form.Select value={coin} onChange={(e) => setCoin(e.target.value)}>
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="AVAX">Avalanche (AVAX)</option>
                  <option value="MTW">MTW (wETH)</option>
                </Form.Select>
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100 mt-3" disabled={loading}>
                {loading ? "Processing..." : "Send Coins"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default SendCoins;
