import React, { useState, useEffect } from "react";
import API from "../services/api";
import AddTransaction from "./AddTransaction";
import EditTransaction from "./EditTransaction";
import DeleteTransaction from "./DeleteTransaction";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const fetchTransactions = async () => {
    try {
      const { data } = await API.get("/transactions");
      setTransactions(data.transactions);
    } catch {
      console.error("Failed to fetch transactions");
    }
  };

  const handleAdd = (newTransaction) => {
    setTransactions([newTransaction, ...transactions]);
  };

  const handleEdit = (updatedTransaction) => {
    setTransactions(
      transactions.map((t) =>
        t._id === updatedTransaction._id ? updatedTransaction : t
      )
    );
    setEditingTransaction(null); // Close edit form
  };

  const handleDelete = (id) => {
    setTransactions(transactions.filter((t) => t._id !== id));
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Manage Transactions</h1>
      <AddTransaction onAdd={handleAdd} />
      {editingTransaction && (
        <EditTransaction
          transaction={editingTransaction}
          onUpdate={handleEdit}
        />
      )}
      <table className="w-full mt-6 border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Type</th>
            <th className="border px-4 py-2">Amount</th>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td className="border px-4 py-2">{transaction.date}</td>
              <td className="border px-4 py-2">{transaction.type}</td>
              <td className="border px-4 py-2">₹{transaction.amount}</td>
              <td className="border px-4 py-2">{transaction.category}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => setEditingTransaction(transaction)}
                  className="mr-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                >
                  Edit
                </button>
                <DeleteTransaction
                  id={transaction._id}
                  onDelete={handleDelete}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsPage;
