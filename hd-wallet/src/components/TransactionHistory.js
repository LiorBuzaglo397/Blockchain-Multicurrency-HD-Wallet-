import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTransactionHistory } from "../blockchain";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Table, Card } from "react-bootstrap";
import CustomNavbar from "../components/Navbar"; // ✅ Import the reusable Navbar

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    checkLoginStatus();
    fetchTransactions();
  }, []);

  function checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
    }
  }

  async function fetchTransactions() {
    try {
      const txs = await getTransactionHistory("ETH");
      setTransactions(txs);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }

  return (
    <div>
      {/* ✅ Using the Custom Navbar */}
      <CustomNavbar />

      {/* Page Content with Padding to Prevent Navbar Overlap */}
      <Container className="mt-5 pt-5 d-flex justify-content-center">
        <Card className="shadow-lg p-4 w-100" style={{ maxWidth: "900px" }}>
          <Card.Body>
            <h3 className="text-primary text-center mb-4">Transaction History</h3>

            {/* Transaction History Table */}
            <div className="table-responsive">
              <Table striped bordered hover className="mt-3 text-center">
                <thead className="bg-light">
                  <tr>
                    <th>Transaction ID</th>
                    <th>Amount (ETH)</th>
                    <th>Recipient</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length > 0 ? (
                    transactions.map((tx) => (
                      <tr key={tx.txid}>
                        <td className="text-truncate" style={{ maxWidth: "200px" }}>{tx.txid}</td>
                        <td className="text-success">{tx.amount}</td>
                        <td>{tx.recipient}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center text-muted">
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default TransactionHistory;
