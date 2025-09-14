const express = require('express');
const { addExpense, getExpenses, updateExpense, deleteExpense, downloadExpenseExcel } = require('../controllers/expenseController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// GET all expenses
router.get('/', protect, getExpenses);

// POST add expense with Cloudinary
router.post('/', protect, addExpense);  // ← just use the array

// PUT update expense
router.put('/:id', protect, updateExpense);

// DELETE expense
router.delete('/:id', protect, deleteExpense);

// Download Excel
router.get('/download', protect, downloadExpenseExcel);

module.exports = router;
