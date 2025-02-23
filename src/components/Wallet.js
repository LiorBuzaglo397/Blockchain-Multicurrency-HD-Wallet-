import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Alert } from "react-bootstrap";
import CustomNavbar from "../components/Navbar";
import { checkBalance } from "../blockchain";


function Wallet() {
  const [username, setUsername] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [ethBalance, setEthBalance] = useState("Fetching...");
  const [avaxBalance, setAvaxBalance] = useState("Fetching...");
  const [ethPrice, setEthPrice] = useState("");
  const [avaxPrice, setAvaxPrice] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchWalletDetails();
    fetchCryptoPrices();
  }, []);

  const fetchWalletDetails = async () => {
    const walletData = JSON.parse(localStorage.getItem("currentUser"));

    if (!walletData || !walletData.address) {
      navigate("/create-wallet");
      return;
    }

    setUsername(walletData.username || "Unknown User");
    setWalletAddress(walletData.address);

    try {
      const ethBalanceResult = await checkBalance("ETH", walletData.address);
      setEthBalance(parseFloat(ethBalanceResult).toFixed(4)); 

      const avaxBalanceResult = await checkBalance("AVAX", walletData.address);
      setAvaxBalance(parseFloat(avaxBalanceResult).toFixed(4));

      console.log("✅ Balances Updated:", ethBalanceResult, avaxBalanceResult);
    } catch (error) {
      setError("Failed to fetch balances");
      console.error("❌ Error fetching balances:", error.message || error);
    }
  };

  const fetchCryptoPrices = async () => {
    const ethPriceUrl = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd";
    const avaxPriceUrl = "https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd";

    try {
      const ethResponse = await fetch(ethPriceUrl);
      const ethData = await ethResponse.json();
      setEthPrice(ethData.ethereum.usd.toFixed(2));

      const avaxResponse = await fetch(avaxPriceUrl);
      const avaxData = await avaxResponse.json();
      setAvaxPrice(avaxData["avalanche-2"].usd.toFixed(2));
    } catch (error) {
      console.error("❌ Failed to fetch cryptocurrency prices:", error);
    }
  };

  return (
    <div>
      <CustomNavbar />
      <Container className="mt-5 pt-5">
      <Card className="shadow-lg text-center p-4 full-page-card">
      <Card.Body>
            <h3 className="text-primary">My Wallet</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            <p className="text-muted">
              Logged in as: <strong>{username}</strong>
            </p>
            <p className="text-muted">Wallet Address: <strong>{walletAddress || "Connecting..."}</strong></p>

            {/* ETH Balance */}
            <Card className="mt-3 p-3 shadow-sm">
              <h5 className="text-dark">ETH Balance:</h5>
              <p className="text-success">{ethBalance} ETH</p>
            </Card>

            {/* AVAX Balance */}
            <Card className="mt-3 p-3 shadow-sm">
              <h5 className="text-dark">AVAX Balance:</h5>
              <p className="text-info">{avaxBalance} AVAX</p>
            </Card>

            {/* Crypto Prices */}
            <div className="d-flex justify-content-center mt-4">
              <Card className="p-3 me-3 border-warning shadow-sm">
                <h5 className="text-warning">ETH Price:</h5>
                <p className="fw-bold">${ethPrice || "Fetching..."}</p>
              </Card>
              <Card className="p-3 border-primary shadow-sm">
                <h5 className="text-primary">AVAX Price:</h5>
                <p className="fw-bold">${avaxPrice || "Fetching..."}</p>
              </Card>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default Wallet;
