import React, { useState } from "react";
import API from "../services/api";

const EditTransaction = ({ transaction, onUpdate }) => {
  const [updatedTransaction, setUpdatedTransaction] = useState(transaction);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setUpdatedTransaction({
      ...updatedTransaction,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const { data } = await API.put(
        `/transactions/${transaction._id}`,
        updatedTransaction
      );
      onUpdate(data.transaction); // Inform parent about the updated transaction
      setError(null);
    } catch (err) {
      setError("Failed to update transaction.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-700 mb-4">Edit Transaction</h2>
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-600">Type:</span>
          <select
            name="type"
            value={updatedTransaction.type}
            onChange={handleChange}
            className="mt-1 px-3 py-2 border rounded-md text-gray-700 focus:ring-2 focus:ring-blue-400"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>
        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-600">Amount:</span>
          <input
            type="number"
            name="amount"
            value={updatedTransaction.amount}
            onChange={handleChange}
            className="mt-1 px-3 py-2 border rounded-md text-gray-700 focus:ring-2 focus:ring-blue-400"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-600">Date:</span>
          <input
            type="date"
            name="date"
            value={updatedTransaction.date.split("T")[0]}
            onChange={handleChange}
            className="mt-1 px-3 py-2 border rounded-md text-gray-700 focus:ring-2 focus:ring-blue-400"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-600">Category:</span>
          <input
            type="text"
            name="category"
            value={updatedTransaction.category}
            onChange={handleChange}
            className="mt-1 px-3 py-2 border rounded-md text-gray-700 focus:ring-2 focus:ring-blue-400"
          />
        </label>
        <label className="col-span-2 flex flex-col">
          <span className="text-sm font-medium text-gray-600">
            Description:
          </span>
          <textarea
            name="description"
            value={updatedTransaction.description}
            onChange={handleChange}
            className="mt-1 px-3 py-2 border rounded-md text-gray-700 focus:ring-2 focus:ring-blue-400"
          ></textarea>
        </label>
      </div>
      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        Update Transaction
      </button>
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
};

export default EditTransaction;
