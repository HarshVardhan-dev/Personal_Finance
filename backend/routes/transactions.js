import express from "express";
import {
  addTransaction,
  editTransaction,
  deleteTransaction,
  getAllTransactions,
  getSummary,
  getFilteredTransactions,
  exportTransactionsAsCSV,
  exportTransactionsAsPDF,
} from "../controllers/transactionController.js";

import Transaction from "../models/Transaction.js";
const router = express.Router();

router.get("/", getAllTransactions);
router.post("/", addTransaction);
router.put("/:id", editTransaction);
router.delete("/:id", deleteTransaction);
router.get("/summary", getSummary);
router.get("/filter", getFilteredTransactions);
router.get("/export/csv", exportTransactionsAsCSV);
router.get("/export/pdf", exportTransactionsAsPDF);

export default router;
