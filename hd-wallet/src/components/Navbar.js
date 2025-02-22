import React from "react";
import { Container, Navbar, Nav, Dropdown, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

// Assuming you have a context or a way to manage global state
import { useUser } from "../UserContext"; // Use the custom hook for accessing user context

function NavigationBar() {
  const navigate = useNavigate();
  const { logout } = useUser(); // Destructure logout directly from the context

  const logOut = () => {
    logout(); // Use the logout function from context
    navigate("/"); // Navigate to home page after logout
  };

  return (
    <Navbar bg="light" expand="lg" fixed="top" className="shadow-sm">
      <Container>
        <Navbar.Brand href="/">HD Wallet</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/wallet">Home</Nav.Link>
            <Dropdown>
              <Dropdown.Toggle variant="outline-primary">Wallet Actions</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="/send-coins">Send Coins</Dropdown.Item>
                <Dropdown.Item href="/transaction-history">Transaction History</Dropdown.Item>
                <Dropdown.Item href="/create-wallet">Create Wallet</Dropdown.Item>
                <Dropdown.Item href="/restore-account">Restore Account</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Button variant="danger" className="ms-3" onClick={logOut}>
              Log Out
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
