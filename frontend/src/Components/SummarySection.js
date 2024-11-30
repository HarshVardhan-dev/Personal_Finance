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
          startDate: "2024-9-01", // Example start date
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
  if (loading)
    return <p className="text-gray-500 italic">Loading summary...</p>;

  // Render error state
  if (error) return <p className="text-red-500 font-semibold">{error}</p>;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-gray-700 mb-4">Summary</h2>
      {summary && (
        <div className="space-y-4">
          {/* Summary Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <p className="text-lg text-gray-600">
              <strong className="font-semibold text-gray-800">
                Total Income:
              </strong>{" "}
              ₹{summary.totalIncome}
            </p>
            <p className="text-lg text-gray-600">
              <strong className="font-semibold text-gray-800">
                Total Expenses:
              </strong>{" "}
              ₹{summary.totalExpenses}
            </p>
            <p className="col-span-full text-lg text-gray-600">
              <strong className="font-semibold text-gray-800">
                Net Balance:
              </strong>{" "}
              ₹{summary.netBalance}
            </p>
          </div>

          {/* Category Breakdown */}
          <h4 className="text-lg font-semibold text-gray-700 mt-6">
            Category Breakdown:
          </h4>
          <ul className="list-disc list-inside space-y-1">
            {Object.entries(summary.categoryBreakdown).map(
              ([category, amount]) => (
                <li key={category} className="text-gray-600">
                  <span className="font-medium text-gray-800">{category}:</span>{" "}
                  ₹{amount}
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
