import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import IncomeOverview from "../../Dashboard/IncomeOverview";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const Income = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });

  const [newIncome, setNewIncome] = useState({
    source: "",
    amount: "",
    date: "",
    description: "",
    iconFile: null, // file object
    iconPreview: null, // preview URL
  });

  // --- Fetch income data ---
  const fetchIncomeDetails = async () => {
    setLoading(true);
    try {
      console.log("Fetching income from:", API_PATHS.INCOMES.GET_INCOMES);
      const response = await axiosInstance.get(API_PATHS.INCOMES.GET_INCOMES);
      console.log("✅ API response:", response.data);
      setIncomeData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("❌ Failed to fetch income:", error.response || error.message);
      setIncomeData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomeDetails();
  }, []);

  // --- Add income ---
  const handleAddIncome = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("source", newIncome.source);
    formData.append("amount", newIncome.amount);
    formData.append("date", newIncome.date);
    formData.append("description", newIncome.description);
    if (newIncome.iconFile) formData.append("icon", newIncome.iconFile);

    try {
      const response = await axiosInstance.post(API_PATHS.INCOMES.ADD_INCOME, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("✅ Added income response:", response.data);

      if (response.data && response.data.income) {
        setIncomeData((prev) => [response.data.income, ...prev]);
        setOpenAddIncomeModal(false);
        setNewIncome({ source: "", amount: "", date: "", description: "", iconFile: null, iconPreview: null });
      }
    } catch (error) {
      console.error("❌ Failed to add income:", error.response || error.message);
      alert("Failed to add income. Check console for details.");
    }
  };

  // --- Delete income ---
  const handleDeleteIncome = async (id) => {
    try {
      await axiosInstance.delete(`${API_PATHS.INCOMES.DELETE_INCOME}/${id}`);
      setIncomeData((prev) => prev.filter((item) => item._id !== id));
      setOpenDeleteAlert({ show: false, data: null });
      console.log("✅ Income deleted successfully");
    } catch (error) {
      console.error("❌ Failed to delete income:", error.response || error.message);
      alert("Failed to delete income. Check console for details.");
    }
  };

  // --- Download income ---
  const handleDownloadIncomeDetails = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.INCOMES.DOWNLOAD_INCOME, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "income_report.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      console.log("✅ Download triggered");
    } catch (error) {
      console.error("❌ Failed to download income:", error.response || error.message);
    }
  };

  return (
    <DashboardLayout activeMenu="income">
      <div className="my-5 mx-auto">
        <IncomeOverview
          transactions={incomeData || []}
          loading={loading}
          onAddIncome={() => setOpenAddIncomeModal(true)}
          onDeleteIncome={(id) => setOpenDeleteAlert({ show: true, data: id })}
          onDownload={handleDownloadIncomeDetails}
        />
      </div>

      {/* Add Income Modal */}
      {openAddIncomeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4">Add Income</h3>
            <form onSubmit={handleAddIncome} className="space-y-4">
              <input
                type="text"
                placeholder="Source"
                value={newIncome.source}
                onChange={(e) => setNewIncome({ ...newIncome, source: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="number"
                placeholder="Amount"
                value={newIncome.amount}
                onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="date"
                placeholder="Date"
                value={newIncome.date}
                onChange={(e) => setNewIncome({ ...newIncome, date: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <textarea
                placeholder="Description (optional)"
                value={newIncome.description}
                onChange={(e) => setNewIncome({ ...newIncome, description: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setNewIncome({
                    ...newIncome,
                    iconFile: e.target.files[0],
                    iconPreview: URL.createObjectURL(e.target.files[0]),
                  })
                }
                className="w-full border px-3 py-2 rounded"
              />
              {newIncome.iconPreview && (
                <img
                  src={newIncome.iconPreview}
                  alt="Icon Preview"
                  className="w-20 h-20 object-cover mt-2 rounded"
                />
              )}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setOpenAddIncomeModal(false)}
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

      {/* Delete Confirmation */}
      {openDeleteAlert.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-md w-96">
            <p className="mb-4">Are you sure you want to delete this income?</p>
            <div className="flex justify-end gap-3">
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => handleDeleteIncome(openDeleteAlert.data)}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-300 px-3 py-1 rounded"
                onClick={() => setOpenDeleteAlert({ show: false, data: null })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Income;
