const express = require('express');
const upload = require('../middlewares/uploadMiddleware'); // Multer setup
const {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  downloadExpenseExcel
} = require('../controllers/expenseController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// GET all expenses
router.get('/', protect, getExpenses);

// POST add expense with optional image
router.post('/', protect, upload.single('icon'), (req, res, next) => {
  if (req.file) req.body.icon = `/uploads/${req.file.filename}`; // save path to DB
  addExpense(req, res, next);
});

// PUT update expense with optional image
router.put('/:id', protect, upload.single('icon'), (req, res, next) => {
  if (req.file) req.body.icon = `/uploads/${req.file.filename}`;
  updateExpense(req, res, next);
});

// DELETE expense
router.delete('/:id', protect, deleteExpense);

// Download Excel
router.get('/download', protect, downloadExpenseExcel);

module.exports = router;