import React from "react";
import { API_BASE_URL } from "../utils/apiPaths";

const IncomeOverview = ({ transactions, loading, onAddIncome, onDeleteIncome, onDownload }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-800">Income Overview</h2>
        <div className="flex gap-2">
          <button
            onClick={onAddIncome}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            + Add Income
          </button>
          <button
            onClick={onDownload}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            Download CSV
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <p className="text-center text-gray-500 py-10">Loading...</p>
      ) : transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 mb-3 text-lg">No income added yet.</p>
          <button
            onClick={onAddIncome}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Add Your First Income
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Icon</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Source</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Description</th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((income) => (
                <tr key={income._id}>
                  <td className="px-4 py-2">
                    {income.icon ? (
                      <img
                        src={income.icon.startsWith("http") ? income.icon : `${API_BASE_URL}${income.icon}`}
                        alt="icon"
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-sm">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2 text-gray-800 font-medium">{income.source}</td>
                  <td className="px-4 py-2 text-gray-800 font-medium">R{income.amount.toLocaleString()}</td>
                  <td className="px-4 py-2 text-gray-800">{income.date ? new Date(income.date).toLocaleDateString() : "N/A"}</td>
                  <td className="px-4 py-2 text-gray-800">{income.description || "-"}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => onDeleteIncome(income._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default IncomeOverview;
