import React, { useState, useEffect } from "react";
import "./css/wallet.css";

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState(1000);
  const [withdrawAmount, setWithdrawAmount] = useState(500);
  const [activeTab, setActiveTab] = useState("deposit");
  const [transactions, setTransactions] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock data for transactions
  useEffect(() => {
    const mockTransactions = [
      { id: 1, type: "deposit", amount: 1000, status: "completed", date: "2023-05-15", time: "10:30 AM" },
      { id: 2, type: "withdrawal", amount: 500, status: "completed", date: "2023-05-14", time: "02:45 PM" },
      { id: 3, type: "deposit", amount: 2000, status: "pending", date: "2023-05-14", time: "09:15 AM" },
      { id: 4, type: "game", amount: 250, status: "win", date: "2023-05-13", time: "11:20 PM" },
      { id: 5, type: "game", amount: 100, status: "loss", date: "2023-05-12", time: "08:45 PM" },
    ];
    setTransactions(mockTransactions);
    setBalance(2250); // Initial balance
  }, []);

  const handleDeposit = () => {
    if (depositAmount <= 0) return;
    setIsProcessing(true);
    setTimeout(() => {
      setBalance(prev => prev + depositAmount);
      setTransactions(prev => [
        {
          id: Date.now(),
          type: "deposit",
          amount: depositAmount,
          status: "completed",
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...prev
      ]);
      setIsProcessing(false);
    }, 1500);
  };

  const handleWithdraw = () => {
    if (withdrawAmount <= 0 || withdrawAmount > balance) return;
    setIsProcessing(true);
    setTimeout(() => {
      setBalance(prev => prev - withdrawAmount);
      setTransactions(prev => [
        {
          id: Date.now(),
          type: "withdrawal",
          amount: withdrawAmount,
          status: "completed",
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...prev
      ]);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="wallet-container">
      {/* Wallet Header */}
      <div className="wallet-header">
        <h1 className="wallet-title">Wallet</h1>
        <p className="wallet-subtitle">Manage your funds and transactions</p>
      </div>

      {/* Balance Card */}
      <div className="balance-card">
        <div className="balance-icon">💰</div>
        <div className="balance-details">
          <p className="balance-label">Your Balance</p>
          <p className="balance-amount">₹{balance.toLocaleString()}</p>
        </div>
        <div className="balance-actions">
          <button 
            className="action-btn quick-deposit"
            onClick={() => setActiveTab("deposit")}
          >
            + Deposit
          </button>
          <button 
            className="action-btn quick-withdraw"
            onClick={() => setActiveTab("withdraw")}
          >
            - Withdraw
          </button>
        </div>
      </div>

      {/* Wallet Tabs */}
      <div className="wallet-tabs">
        <button
          className={`wallet-tab ${activeTab === "deposit" ? "active" : ""}`}
          onClick={() => setActiveTab("deposit")}
        >
          Deposit
        </button>
        <button
          className={`wallet-tab ${activeTab === "withdraw" ? "active" : ""}`}
          onClick={() => setActiveTab("withdraw")}
        >
          Withdraw
        </button>
        <button
          className={`wallet-tab ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          Transaction History
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "deposit" && (
          <div className="deposit-tab">
            <div className="payment-methods">
              <h3 className="section-title">Payment Methods</h3>
              <div className="method-grid">
                <div className="method-card active">
                  <div className="method-icon">💳</div>
                  <p className="method-name">Credit Card</p>
                </div>
                <div className="method-card">
                  <div className="method-icon">🏦</div>
                  <p className="method-name">Bank Transfer</p>
                </div>
                <div className="method-card">
                  <div className="method-icon">📱</div>
                  <p className="method-name">UPI</p>
                </div>
                <div className="method-card">
                  <div className="method-icon">🪙</div>
                  <p className="method-name">Crypto</p>
                </div>
              </div>
            </div>

            <div className="deposit-form">
              <h3 className="section-title">Deposit Amount</h3>
              <div className="amount-options">
                <button className="amount-option" onClick={() => setDepositAmount(500)}>₹500</button>
                <button className="amount-option" onClick={() => setDepositAmount(1000)}>₹1,000</button>
                <button className="amount-option" onClick={() => setDepositAmount(2000)}>₹2,000</button>
                <button className="amount-option" onClick={() => setDepositAmount(5000)}>₹5,000</button>
              </div>
              <div className="custom-amount">
                <label htmlFor="deposit-amount">Custom Amount (₹)</label>
                <input
                  type="number"
                  id="deposit-amount"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  min="100"
                  max="100000"
                />
              </div>
              <button
                className="submit-btn deposit-btn"
                onClick={handleDeposit}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Deposit Now"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "withdraw" && (
          <div className="withdraw-tab">
            <div className="withdraw-form">
              <h3 className="section-title">Withdraw Amount</h3>
              <div className="amount-options">
                <button className="amount-option" onClick={() => setWithdrawAmount(500)}>₹500</button>
                <button className="amount-option" onClick={() => setWithdrawAmount(1000)}>₹1,000</button>
                <button className="amount-option" onClick={() => setWithdrawAmount(2000)}>₹2,000</button>
                <button className="amount-option" onClick={() => setWithdrawAmount(balance)}>All</button>
              </div>
              <div className="custom-amount">
                <label htmlFor="withdraw-amount">Custom Amount (₹)</label>
                <input
                  type="number"
                  id="withdraw-amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  min="100"
                  max={balance}
                />
              </div>
              <div className="bank-details">
                <h3 className="section-title">Bank Details</h3>
                <div className="bank-card">
                  <div className="bank-icon">🏦</div>
                  <div className="bank-info">
                    <p className="bank-name">State Bank of India</p>
                    <p className="account-number">XXXX-XXXX-7890</p>
                  </div>
                </div>
              </div>
              <button
                className="submit-btn withdraw-btn"
                onClick={handleWithdraw}
                disabled={isProcessing || withdrawAmount > balance}
              >
                {isProcessing ? "Processing..." : "Withdraw Now"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="history-tab">
            <div className="transaction-filters">
              <button className="filter-btn active">All</button>
              <button className="filter-btn">Deposits</button>
              <button className="filter-btn">Withdrawals</button>
              <button className="filter-btn">Games</button>
            </div>
            <div className="transaction-list">
              {transactions.length > 0 ? (
                transactions.map((txn) => (
                  <div key={txn.id} className={`transaction-card ${txn.type} ${txn.status}`}>
                    <div className="transaction-icon">
                      {txn.type === "deposit" ? "📥" : 
                       txn.type === "withdrawal" ? "📤" : 
                       txn.status === "win" ? "💰" : "🎮"}
                    </div>
                    <div className="transaction-details">
                      <p className="transaction-type">
                        {txn.type === "deposit" ? "Deposit" : 
                         txn.type === "withdrawal" ? "Withdrawal" : 
                         txn.status === "win" ? "Game Win" : "Game Play"}
                      </p>
                      <p className="transaction-date">{txn.date} • {txn.time}</p>
                    </div>
                    <div className={`transaction-amount ${txn.status}`}>
                      {txn.type === "deposit" ? "+" : txn.status === "win" ? "+" : "-"}₹{txn.amount.toLocaleString()}
                    </div>
                    <div className={`transaction-status ${txn.status}`}>
                      {txn.status}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📄</div>
                  <p>No transactions yet</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
