import React from "react";
import API from "../services/api";

const DeleteTransaction = ({ id, onDelete }) => {
  const handleDelete = async () => {
    try {
      await API.delete(`/transactions/${id}`);
      onDelete(id); // Inform parent to remove the transaction from the list
    } catch (err) {
      console.error("Failed to delete transaction", err);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
    >
      Delete
    </button>
  );
};

export default DeleteTransaction;
