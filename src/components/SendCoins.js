import React, { useState, useEffect } from "react";
import { sendCoins } from "../mainsfuncs"; 
import { checkBalance } from "../blockchain"; 
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Card, Form, Button, Alert, Row, Col } from "react-bootstrap";
import CustomNavbar from "../components/Navbar";

function SendCoins() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [coin, setCoin] = useState("ETH");
  const [balance, setBalance] = useState("Fetching...");
  const [username, setUsername] = useState("");
  const [walletAddress, setWalletAddress] = useState(""); 
  const [message, setMessage] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWalletDetails();
  }, [coin]);

  async function fetchWalletDetails() {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!currentUser || !currentUser.address) {
        setBalance("0.0000");
        setUsername("Unknown User");
        setWalletAddress("N/A");
        return;
      }

      setUsername(currentUser.username || "Unknown User");
      setWalletAddress(currentUser.address);
      const userBalance = await checkBalance(coin, currentUser.address);
      setBalance(parseFloat(userBalance).toFixed(4));
    } catch (error) {
      console.error("❌ Error fetching balance:", error);
      setBalance("Error");
    }
  }

  async function handleSend(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("🚀 Sending transaction...");
    setTransactionHash("");

    try {
      if (!recipient || !amount || !coin) {
        throw new Error("❌ Please fill in all fields.");
      }

      const amountToSend = parseFloat(amount);
      const availableBalance = parseFloat(balance);

      if (isNaN(amountToSend) || amountToSend <= 0) {
        throw new Error("❌ Invalid amount.");
      }

      if (amountToSend > availableBalance) {
        throw new Error(`❌ Insufficient balance. Your current ${coin} balance is ${balance}`);
      }

      const txHash = await sendCoins(recipient, amount, coin, setMessage);
      setTransactionHash(txHash);
      setMessage("✅ Transaction Successful!");
      fetchWalletDetails();
    } catch (error) {
      setMessage("❌ Transaction failed: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="send-coins-page">
      <CustomNavbar />
      <Container fluid className="send-coins-container">
        <Row className="justify-content-center">
          <Col md={30} lg={55}>
            <Card className="p-4 border-0 bg-light shadow-sm">
              <Card.Body>
                <h3 className="text-primary text-center mb-4">Send Coins</h3>

                {message && (
                  <Alert variant={message.startsWith("✅") ? "success" : "danger"} className="text-center">
                    {message}
                  </Alert>
                )}

                <Form onSubmit={handleSend}>
                  <Form.Group className="mb-3">
                    <Form.Label>Your Wallet Address (From)</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={walletAddress} 
                      readOnly 
                      className="fs-5 py-2 bg-secondary text-white"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Recipient's Wallet Address (To)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter recipient address"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      required
                      className="fs-5 py-2"
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                          type="number"
                          step="any"
                          placeholder="Enter amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          required
                          className="fs-5 py-2"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Select Coin</Form.Label>
                        <Form.Select value={coin} onChange={(e) => setCoin(e.target.value)} className="fs-5 py-2">
                          <option value="ETH">Ethereum (ETH)</option>
                          <option value="AVAX">Avalanche (AVAX)</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Alert variant="light" className="text-center fs-5">
                    <strong>Your {coin} Balance:</strong> {balance}
                  </Alert>

                  <Button type="submit" variant="success" className="w-100 mt-3 py-3 fs-5" disabled={loading}>
                    {loading ? "Processing..." : "Send Coins"}
                  </Button>
                </Form>

                {transactionHash && (
                  <Alert variant="info" className="mt-4 text-center fs-5">
                    <strong>Transaction Hash:</strong>
                    <br />
                    <a 
                      href={`https://sepolia.etherscan.io/tx/${transactionHash}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-break"
                    >
                      {transactionHash}
                    </a>
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default SendCoins;
