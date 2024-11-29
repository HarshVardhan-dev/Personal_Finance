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
    <div>
      <h2>Filter Transactions</h2>
      <div>
        <label>
          Type:
          <select name="type" value={filters.type} onChange={handleChange}>
            <option value="">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>
        <label>
          Category:
          <input
            type="text"
            name="category"
            value={filters.category}
            onChange={handleChange}
            placeholder="e.g., Salary, Rent"
          />
        </label>
        <label>
          Min Amount:
          <input
            type="number"
            name="minAmount"
            value={filters.minAmount}
            onChange={handleChange}
          />
        </label>
        <label>
          Max Amount:
          <input
            type="number"
            name="maxAmount"
            value={filters.maxAmount}
            onChange={handleChange}
          />
        </label>
        <label>
          Page:
          <input
            type="number"
            name="page"
            value={filters.page}
            onChange={handleChange}
          />
        </label>
        <label>
          Limit:
          <input
            type="number"
            name="limit"
            value={filters.limit}
            onChange={handleChange}
          />
        </label>
        <button onClick={handleFilter}>Apply Filters</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};

export default FilterTransactions;
