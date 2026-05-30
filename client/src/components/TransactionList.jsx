import React from 'react';
import '../styles/TransactionList.css';

const TransactionList = ({ transactions, onDelete, onEdit }) => {
  const getTypeIcon = (type) => {
    return type === 'income' ? '📈' : '📉';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  if (transactions.length === 0) {
    return (
      <div className="empty-state">
         <h3>📭 No Transactions Found</h3>
         <p>Add your first transaction to start tracking expenses.</p>
      </div>
    );
  }

  return (
    <div className="transactions-box">
      <h2>
         Recent Transactions ({transactions.length})
       </h2>
      <div className="transactions-list">
        {transactions.map(transaction => (
          <div key={transaction._id} className={`transaction-item ${transaction.type}`}>
            <div className="transaction-info">
              <div>
                <span className="icon">{getTypeIcon(transaction.type)}</span>
                <div className="details">
                  <p className="category">{transaction.category}</p>
                  <p className="description">{transaction.description || 'No description'}</p>
                </div>
              </div>
              <div className="amount">
                <p className={`price ${transaction.type}`}>
                  {transaction.type === 'income' ? '+' : '-'} ₹{transaction.amount}
                </p>
                <p className="date">{formatDate(transaction.date)}</p>
              </div>
            </div>
            <div className="actions">
              <button 
                onClick={() => onEdit(transaction._id)}
                className="btn-edit"
              >
                Edit
              </button>
              <button 
                onClick={() => onDelete(transaction._id)}
                className="btn-delete"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;