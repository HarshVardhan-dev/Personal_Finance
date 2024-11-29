import React, { useState } from "react";
import TransactionTable from "../Components/TransactionTable";
import SummarySection from "../Components/SummarySection";
import FilterTransactions from "../Components/FilterTransactions";

const Dashboard = () => {
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  console.log("filteredTransactions", filteredTransactions);
  return (
    <>
      <h1>Dashboard</h1>
      <SummarySection />
      <FilterTransactions onFilter={setFilteredTransactions} />
      <TransactionTable transactions={filteredTransactions} />
    </>
  );
};

export default Dashboard;
