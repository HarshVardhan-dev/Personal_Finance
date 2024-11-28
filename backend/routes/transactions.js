import express from "express";
import {
  addTransaction,
  editTransaction,
  deleteTransaction,
} from "../controllers/transactionController.js";

const router = express.Router();

// POST: Add a new transaction
router.post("/", addTransaction);
router.put("/:id", editTransaction);
router.delete("/:id", deleteTransaction);

export default router;
