const express = require('express');
const {
    addIncome,
    getIncomes,
    updateIncome,
    deleteIncome,
    downloadIncomeExcel
} = require('../controllers/incomeController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// GET /api/v1/income => Get all incomes
router.get('/', protect, getIncomes);

// POST /api/v1/income => Add new income
router.post('/', protect, addIncome);

// PUT /api/v1/income/:id => Update income by ID
router.put('/:id', protect, updateIncome);

// DELETE /api/v1/income/:id => Delete income by ID
router.delete('/:id', protect, deleteIncome);

// GET /api/v1/income/download => Download Excel of incomes
router.get('/download', protect, downloadIncomeExcel);

module.exports = router;
