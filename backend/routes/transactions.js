import express from "express";
import {
  addTransaction,
  editTransaction,
  deleteTransaction,
  getAllTransactions,
} from "../controllers/transactionController.js";

const router = express.Router();

router.get("/", getAllTransactions);
router.post("/", addTransaction);
router.put("/:id", editTransaction);
router.delete("/:id", deleteTransaction);

export default router;
