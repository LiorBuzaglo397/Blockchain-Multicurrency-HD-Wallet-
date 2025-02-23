import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import { getTransactionHistory } from "../blockchain";
import { Container, Table, Card, Alert, Row, Col } from "react-bootstrap";
import CustomNavbar from "../components/Navbar";

function TransactionHistory() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    fetchTransactions();
  }, [user]);

  async function fetchTransactions() {
    try {
      console.log("🚀 Fetching transactions...");
      const txs = await getTransactionHistory("ETH", user?.address);

      if (!txs || !Array.isArray(txs)) {
        throw new Error("No transaction history found.");
      }

      setTransactions(txs);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to fetch transactions.");
    }
  }

  return (
    <div>
      <CustomNavbar />

      <Container className="mt-3 pt-3">
        <Row className="justify-content-center">
          <Col xs={12} md={25} lg={45}>
            <Card className="shadow-lg p-4 rounded-4" style={{ minHeight: "70vh" }}>
              <Card.Body>
                <h3 className="text-primary text-center">My Wallet</h3>
                <p className="text-muted text-center">
                  Logged in as: <strong>{user?.username || "Unknown User"}</strong>
                </p>

                <h3 className="text-primary text-center mb-4">Transaction History</h3>

                {error && <Alert variant="danger" className="text-center">{error}</Alert>}

                <div className="table-responsive" style={{ overflowX: "auto", minHeight: "50vh" }}>
                  <Table striped bordered hover className="mt-3 text-center">
                    <thead className="bg-light">
                      <tr>
                        <th>#</th>
                        <th>Transaction Hash</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Amount</th>
                        <th>Currency</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.length > 0 ? (
                        transactions.map((tx, index) => (
                          <tr key={tx.hash || index}>
                            <td>{index + 1}</td>
                            <td>
                              <a
                                href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-break text-decoration-none"
                              >
                                {tx.hash ? tx.hash.slice(0, 10) + "..." : "N/A"}
                              </a>
                            </td>
                            <td className="text-muted">{tx.from || "N/A"}</td>
                            <td className="text-muted">{tx.to || "N/A"}</td>
                            <td className="text-success">
                              {tx.value ? (parseFloat(tx.value) / 10 ** 18).toFixed(6) : "N/A"}
                            </td>
                            <td>ETH</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center text-muted">
                            No transactions found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default TransactionHistory;
