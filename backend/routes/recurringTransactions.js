import express from "express";
import {
  addRecurringTransaction,
  // generateRecurringTransactions,
} from "../controllers/recurringTransactionController.js";

const router = express.Router();

// Add a recurring transaction
router.post("/", addRecurringTransaction);

export default router;
