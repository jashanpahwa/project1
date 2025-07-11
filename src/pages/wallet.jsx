import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ⬅️ Add this line
import "./css/wallet.css";

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState(1000);
  const [withdrawAmount, setWithdrawAmount] = useState(500);
  const [activeTab, setActiveTab] = useState("deposit");
  const [transactions, setTransactions] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const navigate = useNavigate();

  // Fetch user balance and transactions
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const [balanceRes, transactionsRes] = await Promise.all([
          fetch('http://localhost:5000/api/user/balance', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          fetch('http://localhost:5000/api/user/transactions', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        ]);

        if (balanceRes.ok) {
          const balanceData = await balanceRes.json();
          setBalance(balanceData.balance);
        }

        if (transactionsRes.ok) {
          const transactionsData = await transactionsRes.json();
          setTransactions(transactionsData);
        }
      } catch (err) {
        console.error('Error fetching wallet data:', err);
      }
    };

    fetchWalletData();
  }, [navigate]);

 const handleDeposit = async () => {
  if (depositAmount <= 0) return;
  setIsProcessing(true);

  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/wallet/deposit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        amount: depositAmount,
        paymentMethod
      })
    });

    const data = await response.json();
    if (response.ok) {
      setTransactions(prev => [data.transaction, ...prev]);
      alert('Deposit request submitted. Please wait for admin approval.');
    } else {
      throw new Error(data.error || 'Deposit request failed');
    }
  } catch (err) {
    alert(`Error: ${err.message}`);
  } finally {
    setIsProcessing(false);
  }
};

const handleWithdraw = async () => {
  if (withdrawAmount <= 0 || withdrawAmount > balance) return;
  setIsProcessing(true);

  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/wallet/withdraw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        amount: withdrawAmount,
        bankDetails: {
          bankName: "State Bank of India",
          accountNumber: "XXXX-XXXX-7890"
        }
      })
    });

    const data = await response.json();
    if (response.ok) {
      setBalance(data.newBalance);
      setTransactions(prev => [data.transaction, ...prev]);
      alert('Withdrawal processed. Amount deducted from your balance pending admin approval.');
    } else {
      throw new Error(data.error || 'Withdrawal failed');
    }
  } catch (err) {
    alert(`Error: ${err.message}`);
  } finally {
    setIsProcessing(false);
  }
};

    // Update the payment method selection in your JSX
  const handleMethodSelect = (method) => {
    setPaymentMethod(method);
    // Add visual feedback for selected method
    document.querySelectorAll('.method-card').forEach(card => {
      card.classList.remove('active');
    });
    document.querySelector(`.method-card[data-method="${method}"]`).classList.add('active');
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
          <div 
            className="method-card active" 
            data-method="credit_card"
            onClick={() => handleMethodSelect("credit_card")}
          >
            <div className="method-icon">💳</div>
            <p className="method-name">Credit Card</p>
          </div>
          <div 
            className="method-card" 
            data-method="bank_transfer"
            onClick={() => handleMethodSelect("bank_transfer")}
          >
            <div className="method-icon">🏦</div>
            <p className="method-name">Bank Transfer</p>
          </div>
          <div 
            className="method-card" 
            data-method="upi"
            onClick={() => handleMethodSelect("upi")}
          >
            <div className="method-icon">📱</div>
            <p className="method-name">UPI</p>
          </div>
          <div 
            className="method-card" 
            data-method="crypto"
            onClick={() => handleMethodSelect("crypto")}
          >
            <div className="method-icon">🪙</div>
            <p className="method-name">Crypto</p>
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
