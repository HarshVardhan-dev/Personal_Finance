import React, { useEffect, useState } from "react";
import API from "../services/api"; // Import your API configuration

const SummarySection = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch summary data
  const fetchSummary = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/transactions/summary", {
        params: {
          startDate: "2024-10-01", // Example start date
          endDate: "2024-11-29", // Example end date
        },
      });
      setSummary(data.summary);
      setError(null); // Clear any previous errors
    } catch (err) {
      setError("Failed to fetch summary data.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch summary on component load
  useEffect(() => {
    fetchSummary();
  }, []);

  // Render loading state
  if (loading) return <p>Loading summary...</p>;

  // Render error state
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Summary</h2>
      {summary && (
        <div>
          <p>
            <strong>Total Income:</strong> ₹{summary.totalIncome}
          </p>
          <p>
            <strong>Total Expenses:</strong> ₹{summary.totalExpenses}
          </p>
          <p>
            <strong>Net Balance:</strong> ₹{summary.netBalance}
          </p>
          <h4>Category Breakdown:</h4>
          <ul>
            {Object.entries(summary.categoryBreakdown).map(
              ([category, amount]) => (
                <li key={category}>
                  {category}: ₹{amount}
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SummarySection;
