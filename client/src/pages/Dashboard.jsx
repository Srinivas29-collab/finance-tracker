import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user, token, logout } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchTransactions();
  }, [token, navigate]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/transactions`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (formData) => {
    try {
      if (editingId) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/transactions/${editingId}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setEditingId(null);
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/transactions`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      }
      fetchTransactions();
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/transactions/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const calculateSummary = () => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, balance: income - expense };
  };

  const { income, expense, balance } = calculateSummary();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Finance Tracker</h1>
          <p>
            Welcome back, <strong>{user?.name}</strong>
          </p>
        </div>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </header>

      <div className="dashboard-content">
        <div className="summary-cards">
          <div className="card income">
            <h3>Income</h3>
            <p>₹{income.toLocaleString()}</p>
          </div>

          <div className="card expense">
            <h3>Expense</h3>
            <p>₹{expense.toLocaleString()}</p>
          </div>

          <div className="card balance">
            <h3>Balance</h3>
            <p>₹{balance.toLocaleString()}</p>
          </div>

          <div className="card total">
            <h3>Total Transactions</h3>
            <p>{transactions.length}</p>
          </div>
        </div>

        <TransactionForm onSubmit={handleAddTransaction} editingId={editingId} />

        {loading ? (
          <div className="loading-box">
            <h3>Loading Transactions...</h3>
          </div>
        ) : (
          <TransactionList 
            transactions={transactions}
            onDelete={handleDeleteTransaction}
            onEdit={setEditingId}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;