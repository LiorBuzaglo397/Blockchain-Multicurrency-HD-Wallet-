import React from "react";
import { Container, Navbar, Nav, Dropdown, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function NavigationBar() {
  const navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem("user");
    navigate("/login");
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
