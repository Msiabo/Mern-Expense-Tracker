const Income = require('../models/Income');
const Expense = require('../models/Expense');
const { isValidObjectId, Types } = require('mongoose');

// Helper: calculate past date
const getPastDate = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
};

// Helper: start of current year
const getStartOfYear = () => new Date(new Date().getFullYear(), 0, 1);

const getDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;

        // ✅ Validate userId
        if (!isValidObjectId(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const userObjectId = new Types.ObjectId(userId);

        // --- Overall totals ---
        const [totalIncomeAgg] = await Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const [totalExpensesAgg] = await Expense.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const totalIncome = totalIncomeAgg?.total || 0;
        const totalExpense = totalExpensesAgg?.total || 0;
        const totalBalance = totalIncome - totalExpense;

        // --- Recent transactions (income + expenses) ---
        const recentIncomes = await Income.find({ userId: userObjectId })
            .sort({ date: -1 })
            .limit(5)
            .lean();

        const recentExpenses = await Expense.find({ userId: userObjectId })
            .sort({ date: -1 })
            .limit(5)
            .lean();

        // ✅ Merge and mark transaction types
        const recentTransactions = [
            ...recentIncomes.map((i) => ({ ...i, type: "income" })),
            ...recentExpenses.map((e) => ({ ...e, type: "expense" }))
        ]
            .sort((a, b) => new Date(b.date) - new Date(a.date)) // newest first
            .slice(0, 5); // keep only 5 latest across both

        // --- Time ranges ---
        const ranges = {
            last7Days: getPastDate(7),
            last30Days: getPastDate(30),
            last60Days: getPastDate(60),
            thisYear: getStartOfYear()
        };

        // Helper: fetch totals for a range
       const getTotals = async (fromDate) => {
    const [incomeAgg] = await Income.aggregate([
        { $match: { userId: userObjectId, date: { $gte: fromDate } } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const [expenseAgg] = await Expense.aggregate([
        { $match: { userId: userObjectId, date: { $gte: fromDate } } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const recentIncomes = await Income.find({ userId: userObjectId, date: { $gte: fromDate } })
        .sort({ date: -1 })
        .limit(5)
        .lean();

    const recentExpenses = await Expense.find({ userId: userObjectId, date: { $gte: fromDate } })
        .sort({ date: -1 })
        .limit(5)
        .lean();

    return {
        totalIncome: incomeAgg?.total || 0,
        totalExpense: expenseAgg?.total || 0,
        recentIncomes,
        recentExpenses
    };
};
        // --- Aggregate dashboard data for ranges ---
        const dashboardData = {};
        for (const [key, fromDate] of Object.entries(ranges)) {
            dashboardData[key] = await getTotals(fromDate);
        }

        // ✅ Final response
        return res.status(200).json({
            totals: {
                balance: totalBalance,
                income: totalIncome,
                expense: totalExpense
            },
            recentTransactions, // ✅ unified + sorted
            dashboardData
        });

    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = { getDashboardData };
