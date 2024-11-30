import React, { useState } from "react";
import API from "../services/api";

const FilterTransactions = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    minAmount: "",
    maxAmount: "",
    page: 1,
    limit: 10,
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilter = async () => {
    try {
      const { data } = await API.get("/transactions/filter", {
        params: filters,
      });
      onFilter(data.data.transactions); // Pass transactions to the parent component
      setError(null);
    } catch (err) {
      setError("Failed to fetch filtered transactions.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-700 mb-4">
        Filter Transactions
      </h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-600">Type:</span>
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="mt-1 px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>
        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-600">Category:</span>
          <input
            type="text"
            name="category"
            value={filters.category}
            onChange={handleChange}
            placeholder="e.g., Salary, Rent"
            className="mt-1 px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-600">Min Amount:</span>
          <input
            type="number"
            name="minAmount"
            value={filters.minAmount}
            onChange={handleChange}
            className="mt-1 px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-600">Max Amount:</span>
          <input
            type="number"
            name="maxAmount"
            value={filters.maxAmount}
            onChange={handleChange}
            className="mt-1 px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-600">Page:</span>
          <input
            type="number"
            name="page"
            value={filters.page}
            onChange={handleChange}
            className="mt-1 px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-600">Limit:</span>
          <input
            type="number"
            name="limit"
            value={filters.limit}
            onChange={handleChange}
            className="mt-1 px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>
      </div>
      <button
        onClick={handleFilter}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        Apply Filters
      </button>
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
};

export default FilterTransactions;
