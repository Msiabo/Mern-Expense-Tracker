const Income = require('../models/Income');
const xlsx = require('xlsx');
const upload = require('../middlewares/uploadMiddleware'); 


// Add Income
exports.addIncome = [
  upload.single('icon'), // 'icon' matches the input field name in your form
  async (req, res) => {
    const { amount, source, date, description } = req.body;
    if (!amount || !source || !date) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
      const iconUrl = req.file ? `/uploads/${req.file.filename}` : null;

      const income = new Income({
        userId: req.user.id,
        icon: iconUrl,
        amount,
        source,
        date,
        description,
      });

      await income.save();
      res.status(201).json({ message: 'Income added successfully', income });
    } catch (error) {
      console.error('Error adding income:', error);
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  }
];


// Get All Incomes for User
exports.getIncomes = async (req, res) => {
    try {
        const incomes = await Income.find({ userId: req.user.id }).sort({ date: -1 });
        res.status(200).json(incomes);
    } catch (error) {
        console.error('Error fetching incomes:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Delete Income
exports.deleteIncome = async (req, res) => {
    try {
        const income = await Income.findById(req.params.id);
        if (!income) {
            return res.status(404).json({ message: 'Income not found' });
        }
        if (income.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        await income.remove();
        res.status(200).json({ message: 'Income deleted successfully' });
    } catch (error) {
        console.error('Error deleting income:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Update Income
exports.updateIncome = async (req, res) => {
    const { amount, source, date, description, icon } = req.body;
    try {
        let income = await Income.findById(req.params.id);
        if (!income) {
            return res.status(404).json({ message: 'Income not found' });
        }
        if (income.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        income = await Income.findByIdAndUpdate(
            req.params.id,
            { amount, source, date, description, icon },
            { new: true, runValidators: true }
        );
        res.status(200).json({ message: 'Income updated successfully', income });
    } catch (error) {
        console.error('Error updating income:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get Single Income
exports.getIncomeById = async (req, res) => {
    try {
        const income = await Income.findById(req.params.id);
        if (!income) {
            return res.status(404).json({ message: 'Income not found' });
        }
        if (income.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        res.status(200).json(income);
    } catch (error) {
        console.error('Error fetching income:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Download income as Excel
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const incomes = await Income.find({ userId }).sort({ date: -1 });
        if (incomes.length === 0) {
            return res.status(404).json({ message: 'No income records found to export' });
        }

        // Prepare data for Excel
        const data = incomes.map((income) => ({
            Icon: income.icon || '',
            Amount: income.amount,
            Source: income.source,
            Date: income.date.toISOString().split('T')[0],
            Description: income.description || '',
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, 'Incomes');
        xlsx.writeFile(wb, 'income_details.xlsx');

        res.download('income_details.xlsx', 'income_details.xlsx', (err) => {
            if (err) {
                console.error('Error downloading the file:', err);
                res.status(500).json({ message: 'Error downloading the file', error: err.message });
            }
        });
    } catch (error) {
        console.error('Error exporting income to Excel:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
