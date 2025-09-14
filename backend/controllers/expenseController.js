const Expense = require('../models/Expense');
const xlsx = require('xlsx');
const { Types, isValidObjectId } = require('mongoose');

// Add Expense
exports.addExpense = [
  upload.single('icon'), // 'icon' matches the input field name from frontend
  async (req, res) => {
    const { amount, source, date, description } = req.body;
    if (!amount || !source || !date) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
      // Use Cloudinary URL if image uploaded
      const iconUrl = req.file ? req.file.path : null;

      const expense = new Expense({
        userId: req.user._id,
        icon: iconUrl,
        amount,
        source,
        date,
        description,
      });

      await expense.save();
      res.status(201).json({ message: 'Expense added successfully', expense });
    } catch (error) {
      console.error('Error adding expense:', error);
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  }
];

// Get All Expenses for User
exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user._id }).sort({ date: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Delete Expense
exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) return res.status(404).json({ message: 'Expense not found' });
        if (expense.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        await expense.remove();
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Update Expense
exports.updateExpense = async (req, res) => {
    const { icon, amount, source, date, description } = req.body;
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) return res.status(404).json({ message: 'Expense not found' });
        if (expense.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedExpense = await Expense.findByIdAndUpdate(
            req.params.id,
            { icon, amount, source, date, description },
            { new: true, runValidators: true }
        );

        res.status(200).json({ message: 'Expense updated successfully', expense: updatedExpense });
    } catch (error) {
        console.error('Error updating expense:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Export Expenses to Excel
exports.downloadExpenseExcel = async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user._id }).sort({ date: -1 });

        if (expenses.length === 0) {
            return res.status(400).json({ message: 'No expenses to export' });
        }

        const expenseData = expenses.map(exp => ({
            Icon: exp.icon || '',
            Amount: exp.amount,
            Source: exp.source,
            Date: exp.date.toISOString().split('T')[0],
            Description: exp.description || ''
        }));

        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(expenseData);
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Expenses');
        const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Disposition', 'attachment; filename="expenses.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.status(200).send(buffer);
    } catch (error) {
        console.error('Error exporting expenses to Excel:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
