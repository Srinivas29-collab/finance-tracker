import React, { useState } from 'react';
import '../styles/TransactionForm.css';

const TransactionForm = ({ onSubmit, editingId }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    description: ''
  });

  const categories = {
    income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
    expense: ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Health', 'Other']
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category || !formData.amount) {
      alert('Please fill all fields');
      return;
    }
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount)
    });
    setFormData({
      type: 'expense',
      category: '',
      amount: '',
      description: ''
    });
  };

  return (
    <div className="form-box">
      <h2>{editingId ? 'Edit Transaction' : 'Add New Transaction'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select category</option>
              {categories[formData.type].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Amount (₹)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Description (Optional)</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add notes..."
            />
          </div>
        </div>

        <button type="submit" className="btn-primary">
          {editingId ? 'Update' : 'Add'} Transaction
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;