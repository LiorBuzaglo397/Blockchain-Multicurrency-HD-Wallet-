import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import { getTransactionHistory } from "../blockchain";
import { Container, Table, Card, Alert } from "react-bootstrap";
import CustomNavbar from "../components/Navbar";

function TransactionHistory() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
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
      {/* ✅ ניווט עליון */}
      <CustomNavbar />

      <Container className="mt-5 pt-5">
        <Card className="shadow-lg p-4">
          <Card.Body>
            <h3 className="text-primary text-center mb-4">Transaction History</h3>

            {/* ✅ הודעת שגיאה במקרה הצורך */}
            {error && <Alert variant="danger">{error}</Alert>}

            {/* ✅ טבלה של עסקאות */}
            <div className="table-responsive">
              <Table striped bordered hover className="mt-3 text-center">
                <thead className="bg-light">
                  <tr>
                    <th>#</th>
                    <th>Transaction Hash</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Amount (ETH)</th>
                    <th>Currency</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length > 0 ? (
                    transactions.map((tx, index) => (
                      <tr key={tx.hash || index}>
                        <td>{index + 1}</td>
                        <td className="text-truncate" style={{ maxWidth: "150px" }}>
                          {tx.hash ? tx.hash.slice(0, 15) + "..." : "N/A"}
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
      </Container>
    </div>
  );
}

export default TransactionHistory;
