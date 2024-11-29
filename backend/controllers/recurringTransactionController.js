import RecurringTransaction from "../models/RecurringTransaction.js";
import Transaction from "../models/Transaction.js";
export const addRecurringTransaction = async (req, res) => {
  try {
    const {
      type,
      amount,
      startDate,
      endDate,
      interval,
      category,
      description,
    } = req.body;

    // Save the recurring transaction
    const recurringTransaction = await RecurringTransaction.create({
      type,
      amount,
      startDate,
      endDate,
      interval,
      category,
      description,
    });

    console.log("Recurring Transaction Created:", recurringTransaction);

    // Pre-create transactions for the entire duration
    const transactions = [];
    let nextTransactionDate = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;

    while (!end || nextTransactionDate <= end) {
      transactions.push({
        type,
        amount,
        date: new Date(nextTransactionDate),
        category,
        description,
      });

      if (interval === "daily") {
        nextTransactionDate.setDate(nextTransactionDate.getDate() + 1);
      } else if (interval === "weekly") {
        nextTransactionDate.setDate(nextTransactionDate.getDate() + 7);
      } else if (interval === "monthly") {
        nextTransactionDate.setMonth(nextTransactionDate.getMonth() + 1);
      }
    }

    console.log("Pre-Creating Transactions:", transactions);

    // Bulk insert transactions
    await Transaction.insertMany(transactions);

    res.status(201).json({
      success: true,
      message: "Recurring transaction added and transactions pre-created",
      recurringTransaction,
      preCreatedTransactions: transactions.length,
    });
  } catch (error) {
    console.error("Error Adding Recurring Transaction:", error.message);
    res.status(500).json({
      success: false,
      message: "Error adding recurring transaction",
      error: error.message,
    });
  }
};
