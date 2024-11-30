import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Dashboard</h1>

      {/* Navigation Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Manage Transactions */}
        <Link
          to="/transactions"
          className="p-6 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition text-center"
        >
          <h2 className="text-xl font-semibold">Manage Transactions</h2>
          <p className="mt-2 text-sm">
            View, add, edit, or delete your transactions.
          </p>
        </Link>

        {/* Example for Summary Section */}
        <Link
          to="/summary"
          className="p-6 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition text-center"
        >
          <h2 className="text-xl font-semibold">View Summary</h2>
          <p className="mt-2 text-sm">
            Analyze your income, expenses, and net balance.
          </p>
        </Link>

        {/* Placeholder for Future Links */}
        <Link
          to="/reports"
          className="p-6 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 transition text-center"
        >
          <h2 className="text-xl font-semibold">Generate Reports</h2>
          <p className="mt-2 text-sm">Create detailed financial reports.</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
