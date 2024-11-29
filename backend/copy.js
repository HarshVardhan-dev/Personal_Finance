import RecurringTransaction from "../models/RecurringTransaction.js";
import Transaction from "../models/Transaction.js";

export const generateRecurringTransactions = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Ensure time is reset for date comparison

  try {
    // Fetch recurring transactions that are active today
    const recurringTransactions = await RecurringTransaction.find({
      startDate: { $lte: today },
      $or: [{ endDate: null }, { endDate: { $gte: today } }],
    });

    console.log("Fetched Recurring Transactions:", recurringTransactions);

    for (const recurring of recurringTransactions) {
      const { type, amount, interval, category, description, startDate } =
        recurring;

      // Fetch the last transaction for this recurring entry
      const lastTransaction = await Transaction.findOne({
        type,
        category,
        description,
      }).sort({ date: -1 });

      console.log("Last Transaction:", lastTransaction);

      // Determine the date to start generating transactions
      let nextTransactionDate = lastTransaction
        ? new Date(lastTransaction.date)
        : new Date(startDate);

      console.log("Initial Next Transaction Date:", nextTransactionDate);

      // Generate transactions until today
      while (nextTransactionDate < today) {
        // Increment the date based on the interval
        if (interval === "daily")
          nextTransactionDate.setDate(nextTransactionDate.getDate() + 1);
        else if (interval === "weekly")
          nextTransactionDate.setDate(nextTransactionDate.getDate() + 7);
        else if (interval === "monthly")
          nextTransactionDate.setMonth(nextTransactionDate.getMonth() + 1);

        console.log("Next Transaction Date:", nextTransactionDate);

        // Skip if the next transaction date exceeds today
        if (nextTransactionDate > today) break;

        // Create the transaction in the database
        await Transaction.create({
          type,
          amount,
          date: nextTransactionDate,
          category,
          description,
        });

        console.log("Transaction Created:", {
          type,
          amount,
          date: nextTransactionDate,
          category,
          description,
        });
      }
    }

    console.log("Recurring transactions generated successfully");
  } catch (error) {
    console.error("Error generating recurring transactions:", error.message);
  }
};
