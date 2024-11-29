import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    timePeriod: { type: String, enum: ["monthly", "yearly"], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true }
);

BudgetSchema.index(
  { category: 1, timePeriod: 1, startDate: 1, endDate: 1 },
  { unique: true }
);

const Budget = mongoose.model("Budget", BudgetSchema);

export default Budget;
