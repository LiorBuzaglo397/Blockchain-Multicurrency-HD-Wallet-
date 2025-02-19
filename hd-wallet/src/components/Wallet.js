import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Card, Button } from "react-bootstrap";
import CustomNavbar from "../components/Navbar"; // ✅ Import the new Navbar component

// 🔹 Infura RPC for Avalanche Fuji Testnet
const AVALANCHE_RPC_URL = "https://avalanche-fuji.infura.io/v3/YOUR_INFURA_PROJECT_ID";
const web3Avax = new Web3(new Web3.providers.HttpProvider(AVALANCHE_RPC_URL));

function Wallet() {
  const [walletAddress, setWalletAddress] = useState("");
  const [ethBalance, setEthBalance] = useState("Fetching...");
  const [avaxBalance, setAvaxBalance] = useState("Fetching...");
  const [ethPrice, setEthPrice] = useState("");
  const [avaxPrice, setAvaxPrice] = useState("");
  const [web3, setWeb3] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkLoginStatus();
    initializeWeb3();
    getEthPrice();
    getAvaxPrice();
  }, []);

  async function initializeWeb3() {
    if (window.ethereum) {
      try {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.getAccounts();
        setWalletAddress(accounts[0]);

        // Fetch ETH Balance
        const balanceWei = await web3Instance.eth.getBalance(accounts[0]);
        setEthBalance(web3Instance.utils.fromWei(balanceWei, "ether") + " ETH");

        // Fetch AVAX Balance
        getUserBalanceAvax(accounts[0]);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      console.error("MetaMask is not installed!");
    }
  }

  function checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
    }
  }

  async function getEthPrice() {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      const data = await response.json();
      setEthPrice(data.ethereum.usd);
    } catch (error) {
      console.error("Error fetching ETH price:", error);
    }
  }

  async function getAvaxPrice() {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd"
      );
      const data = await response.json();
      setAvaxPrice(data["avalanche-2"].usd);
    } catch (error) {
      console.error("Error fetching AVAX price:", error);
    }
  }

  /**
   * ✅ Fetch Real AVAX Balance
   * @param {string} address - Wallet Address
   */
  async function getUserBalanceAvax(address) {
    try {
      if (!Web3.utils.isAddress(address)) throw new Error("Invalid AVAX address");

      const balanceWei = await web3Avax.eth.getBalance(address);
      const balanceAvax = web3Avax.utils.fromWei(balanceWei, "ether");

      setAvaxBalance(`${balanceAvax} AVAX`);
    } catch (error) {
      console.error("Error fetching AVAX balance:", error);
      setAvaxBalance("Error fetching balance");
    }
  }

  return (
    <div>
      {/* ✅ Now using the Custom Navbar */}
      <CustomNavbar />

      {/* Page Content with Top Padding to Prevent Overlap */}
      <Container className="mt-5 pt-5">
        <Card className="shadow-lg text-center p-4">
          <Card.Body>
            <h3 className="text-primary">My Wallet</h3>
            <p className="text-muted">
              Logged in as: <strong>{walletAddress ? walletAddress : "Connecting..."}</strong>
            </p>

            <Card className="mt-3 p-3 shadow-sm">
              <h5 className="text-dark">My Address:</h5>
              <p className="text-muted">{walletAddress}</p>
            </Card>

            <Card className="mt-3 p-3 shadow-sm">
              <h5 className="text-dark">My ETH Balance:</h5>
              <p className="text-success">{ethBalance}</p>
            </Card>

            <Card className="mt-3 p-3 shadow-sm">
              <h5 className="text-dark">My AVAX Balance:</h5>
              <p className="text-info">{avaxBalance}</p>
            </Card>

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
