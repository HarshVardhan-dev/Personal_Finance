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
  searchTransactions,
} from "../controllers/transactionController.js";

const router = express.Router();

router.get("/", getAllTransactions);
router.post("/", addTransaction);
router.put("/:id", editTransaction);
router.delete("/:id", deleteTransaction);
router.get("/summary", getSummary);
router.get("/filter", getFilteredTransactions);
router.get("/export/csv", exportTransactionsAsCSV);
router.get("/export/pdf", exportTransactionsAsPDF);
router.get("/search", searchTransactions);

export default router;
