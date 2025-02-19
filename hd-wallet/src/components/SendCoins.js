import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendSignedTransaction } from "../blockchain";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Card, Button, Form } from "react-bootstrap";
import CustomNavbar from "../components/Navbar"; // ✅ Importing the reusable Navbar

function SendCoins() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();

  function handleSend(event) {
    event.preventDefault();
    sendSignedTransaction("ETH", recipient, amount)
      .then((txid) => alert(`Transaction sent! TXID: ${txid}`))
      .catch(console.error);
  }

  return (
    <div>
      {/* ✅ Using the Custom Navbar */}
      <CustomNavbar />

      {/* Page Content with Top Padding to Prevent Overlap */}
      <Container className="mt-5 pt-5">
        <Card className="shadow-lg text-center p-4">
          <Card.Body>
            <h3 className="text-primary">Send Coins</h3>
            <Form onSubmit={handleSend} className="mt-4">
              <Form.Group className="mb-3">
                <Form.Label>Recipient Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter recipient's wallet address"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </Form.Group>

              <Button type="submit" variant="success" className="mt-2 w-100">
                Send Coins
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default SendCoins;
