import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { restoreAccount } from "../mainsfuncs";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Card, Button, Form, Row, Col } from "react-bootstrap";
import CustomNavbar from "../components/Navbar"; // ✅ Import Custom Navbar

function RestoreAccount() {
  const [seedPhrase, setSeedPhrase] = useState(Array(12).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    const newSeedPhrase = [...seedPhrase];
    newSeedPhrase[index] = value;
    setSeedPhrase(newSeedPhrase);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullSeedPhrase = seedPhrase.join(" ").trim();
    const result = restoreAccount(fullSeedPhrase, newPassword);
    setMessage(result);

    if (result.includes("Successfully")) {
      setTimeout(() => navigate("/wallet"), 2000);
    }
  };

  return (
    <div>
      {/* ✅ Reusable Navbar */}

      {/* Page Content with Padding */}
      <Container className="mt-5 pt-5 d-flex justify-content-center">
        <Card className="shadow-lg p-4 w-100" style={{ maxWidth: "600px" }}>
          <Card.Body>
            <h3 className="text-primary text-center mb-4">Restore Account</h3>

            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Seed Phrase</Form.Label>
                <Row>
                  {seedPhrase.map((word, index) => (
                    <Col key={index} xs={4} className="mb-2">
                      <Form.Control
                        type="text"
                        placeholder={`Word ${index + 1}`}
                        value={word}
                        onChange={(e) => handleChange(index, e.target.value)}
                        required
                      />
                    </Col>
                  ))}
                </Row>
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button type="submit" variant="success" className="mt-3 w-100">
                Restore Account
              </Button>
            </Form>

            {message && <p className="text-center mt-3 text-danger">{message}</p>}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default RestoreAccount;
