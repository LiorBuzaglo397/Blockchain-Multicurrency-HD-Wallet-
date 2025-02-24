import React from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Navbar.css"; 
import { useUser } from "../UserContext"; 

function NavigationBar() {
  const navigate = useNavigate();
  const { logout, user } = useUser(); 

  const logOut = () => {
    logout();
    navigate("/");
  };

  return (
    <Navbar expand="lg" fixed="top" className="custom-navbar shadow-sm">
      <Container className="d-flex justify-content-center">
        <Navbar.Brand className="fw-bold text-light mx-auto" href="#/">
          HD Wallet
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 bg-light" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
          <Nav className="d-flex align-items-center gap-4">
            <Nav.Link className="nav-link-custom" href="#/wallet">Home</Nav.Link>
            <Nav.Link className="nav-link-custom" href="#/send-coins">Send Coins</Nav.Link>
            <Nav.Link className="nav-link-custom" href="#/transaction-history">Transactions</Nav.Link>
            <Button variant="outline-light" className="fw-bold logout-btn" onClick={logOut}>
              Log Out
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
