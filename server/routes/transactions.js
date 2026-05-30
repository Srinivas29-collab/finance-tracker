const express = require('express');
const Transaction = require('../model/Transaction');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET all transactions
router.get('/', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId })
      .sort({ date: -1 });

    res.json({
      success: true,
      count: transactions.length,
      transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching transactions: ' + error.message
    });
  }
});

// CREATE a new transaction
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { type, category, amount, description, date } = req.body;

    if (!type || !category || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide type, category, and amount'
      });
    }

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type must be "income" or "expense"'
      });
    }

    const transaction = await Transaction.create({
      userId: req.userId,
      type,
      category,
      amount,
      description: description || '',
      date: date ? new Date(date) : new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Transaction created',
      transaction
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating transaction: ' + error.message
    });
  }
});

// UPDATE a transaction
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { type, category, amount, description, date } = req.body;

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    if (transaction.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this transaction'
      });
    }

    if (type) transaction.type = type;
    if (category) transaction.category = category;
    if (amount) transaction.amount = amount;
    if (description !== undefined) transaction.description = description;
    if (date) transaction.date = new Date(date);

    await transaction.save();

    res.json({
      success: true,
      message: 'Transaction updated',
      transaction
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating transaction: ' + error.message
    });
  }
});

// DELETE a transaction
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    if (transaction.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this transaction'
      });
    }

    await Transaction.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Transaction deleted'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting transaction: ' + error.message
    });
  }
});

module.exports = router;