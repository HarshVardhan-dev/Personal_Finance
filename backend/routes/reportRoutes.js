import express from "express";
import {
  getCategoryWiseReport,
  getTimeSeriesReport,
} from "../controllers/reportController.js";

const router = express.Router();

// Route to get category-wise report
router.get("/category-wise", getCategoryWiseReport);

// Route to get time-series report
router.get("/time-series", getTimeSeriesReport);

export default router;
