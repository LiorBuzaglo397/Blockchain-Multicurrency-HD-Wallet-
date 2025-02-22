import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Alert } from "react-bootstrap";
import CustomNavbar from "../components/Navbar";
import { checkBalance, getTransactionHistory } from "../blockchain";

function Wallet() {
  const [walletAddress, setWalletAddress] = useState("");
  const [ethBalance, setEthBalance] = useState("Fetching...");
  const [avaxBalance, setAvaxBalance] = useState("Fetching...");
  const [mtwBalance, setMtwBalance] = useState("Fetching...");
  const [ethPrice, setEthPrice] = useState("");
  const [avaxPrice, setAvaxPrice] = useState("");
  const [mtwTransactions, setMtwTransactions] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchWalletDetails();
    fetchCryptoPrices();
  }, []);

  const fetchWalletDetails = async () => {
    const walletData = JSON.parse(localStorage.getItem("userData"));
    if (!walletData || !walletData.address) {
      navigate("/create-wallet");
      return;
    }
    setWalletAddress(walletData.address);

    try {
      const ethBalanceResult = await checkBalance("ETH", walletData.address);
      setEthBalance(`${ethBalanceResult} ETH`);

      const avaxBalanceResult = await checkBalance("AVAX", walletData.address);
      setAvaxBalance(`${avaxBalanceResult} AVAX`);

      const mtwBalanceResult = await checkBalance("MTW", walletData.address);
      setMtwBalance(`${mtwBalanceResult} wETH`);

      const mtwTransactionsResult = await getTransactionHistory("MTW", walletData.address);
      setMtwTransactions(mtwTransactionsResult);

      console.log("✅ Balances Updated:", ethBalanceResult, avaxBalanceResult, mtwBalanceResult);
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
      setEthPrice(ethData.ethereum.usd);

      const avaxResponse = await fetch(avaxPriceUrl);
      const avaxData = await avaxResponse.json();
      setAvaxPrice(avaxData["avalanche-2"].usd);
    } catch (error) {
      console.error("❌ Failed to fetch cryptocurrency prices:", error);
    }
  };

  return (
    <div>
      <CustomNavbar />
      <Container className="mt-5 pt-5">
        <Card className="shadow-lg text-center p-4">
          <Card.Body>
            <h3 className="text-primary">My Wallet</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            <p className="text-muted">Logged in as: <strong>{walletAddress || "Connecting..."}</strong></p>

            <Card className="mt-3 p-3 shadow-sm">
              <h5 className="text-dark">My Address:</h5>
              <p className="text-muted">{walletAddress}</p>
            </Card>

            <Card className="mt-3 p-3 shadow-sm">
              <h5 className="text-dark">ETH Balance:</h5>
              <p className="text-success">{ethBalance}</p>
            </Card>

            <Card className="mt-3 p-3 shadow-sm">
              <h5 className="text-dark">AVAX Balance:</h5>
              <p className="text-info">{avaxBalance}</p>
            </Card>

            <Card className="mt-3 p-3 shadow-sm">
              <h5 className="text-dark">MTW Balance:</h5>
              <p className="text-warning">{mtwBalance}</p>
            </Card>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default Wallet;
