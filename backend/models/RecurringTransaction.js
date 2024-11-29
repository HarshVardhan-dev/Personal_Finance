import mongoose from "mongoose";

const RecurringTransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["income", "expense"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  interval: {
    type: String,
    enum: ["daily", "weekly", "monthly"],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
});

const RecurringTransaction = mongoose.model(
  "RecurringTransaction",
  RecurringTransactionSchema
);
export default RecurringTransaction;
