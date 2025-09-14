import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import ExpenseOverview from "../../Dashboard/ExpenseOverview";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

  const [newExpense, setNewExpense] = useState({
    source: "",
    amount: "",
    date: "",
    iconFile: null,
    description: "",
  });

  // Fetch expenses
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(API_PATHS.EXPENSES.GET_EXPENSES);
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Add Expense with file upload
  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("source", newExpense.source);
      formData.append("amount", Number(newExpense.amount));
      formData.append("date", newExpense.date);
      formData.append("description", newExpense.description || "");
      if (newExpense.iconFile) {
        formData.append("icon", newExpense.iconFile);
      }

      const res = await axiosInstance.post(API_PATHS.EXPENSES.ADD_EXPENSE, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setExpenses([...expenses, res.data.expense]);
      setOpenAddExpenseModal(false);
      setNewExpense({ source: "", amount: "", date: "", iconFile: null, description: "" });
    } catch (err) {
      console.error("Failed to add expense:", err);
      alert("Failed to add expense. Check console.");
    }
  };

  // Delete expense
  const handleDeleteExpense = async (id) => {
    try {
      await axiosInstance.delete(`${API_PATHS.EXPENSES.DELETE_EXPENSE}/${id}`);
      setExpenses(expenses.filter((exp) => exp._id !== id));
    } catch (err) {
      console.error("Failed to delete expense:", err);
    }
  };

  // Download
  const handleDownload = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.EXPENSES.DOWNLOAD_EXPENSE, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expenses.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to download expenses:", err);
    }
  };

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        <ExpenseOverview
          transactions={expenses}
          loading={loading}
          onAddExpense={() => setOpenAddExpenseModal(true)}
          onDeleteExpense={handleDeleteExpense}
          onDownload={handleDownload}
        />
      </div>

      {/* Add Expense Modal */}
      {openAddExpenseModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4">Add Expense</h3>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <input
                type="text"
                placeholder="Source"
                value={newExpense.source}
                onChange={(e) => setNewExpense({ ...newExpense, source: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="number"
                placeholder="Amount"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewExpense({ ...newExpense, iconFile: e.target.files[0] })}
                className="w-full border px-3 py-2 rounded"
              />
              <textarea
                placeholder="Description (optional)"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpenAddExpenseModal(false)}
                  className="bg-gray-300 px-3 py-1 rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Expense;
