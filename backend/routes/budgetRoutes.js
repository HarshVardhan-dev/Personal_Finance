import express from "express";
import {
  addBudget,
  compareActualVsBudgeted,
  getOverspendingAlerts,
} from "../controllers/budgetController.js";

const router = express.Router();

router.post("/", addBudget);
router.get("/comparison", compareActualVsBudgeted);
router.get("/alerts", getOverspendingAlerts);
export default router;
