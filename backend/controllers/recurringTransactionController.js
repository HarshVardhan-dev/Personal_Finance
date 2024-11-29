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

// export const generateRecurringTransactions = async () => {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate comparison

//   try {
//     // Fetch active recurring transactions that are due today or earlier
//     const recurringTransactions = await RecurringTransaction.find({
//       startDate: { $lte: today },
//       $or: [{ endDate: null }, { endDate: { $gte: today } }],
//     });

//     console.log("Fetched Recurring Transactions:", recurringTransactions);

//     for (const recurring of recurringTransactions) {
//       const {
//         type,
//         amount,
//         interval,
//         category,
//         description,
//         startDate,
//         _id: recurringId,
//       } = recurring;

//       console.log("Processing Recurring Transaction:", recurring);

//       // Fetch the last transaction for this recurring entry
//       const lastTransaction = await Transaction.findOne({
//         recurringId,
//       }).sort({ date: -1 });

//       console.log("Last Transaction Found:", lastTransaction);

//       // Determine the next transaction date
//       let nextTransactionDate = lastTransaction
//         ? new Date(lastTransaction.date)
//         : new Date(startDate);

//       // Increment the date based on the interval
//       if (interval === "daily") {
//         nextTransactionDate.setDate(nextTransactionDate.getDate() + 1);
//       } else if (interval === "weekly") {
//         nextTransactionDate.setDate(nextTransactionDate.getDate() + 7);
//       } else if (interval === "monthly") {
//         nextTransactionDate.setMonth(nextTransactionDate.getMonth() + 1);
//       }

//       console.log("Next Transaction Date:", nextTransactionDate);

//       // Only generate the transaction if the date matches today
//       if (nextTransactionDate.toDateString() === today.toDateString()) {
//         console.log("Generating transaction for today:", nextTransactionDate);

//         // Check for duplicate transaction
//         const existingTransaction = await Transaction.findOne({
//           recurringId,
//           date: nextTransactionDate,
//         });

//         if (!existingTransaction) {
//           try {
//             // Create the transaction
//             const transaction = await Transaction.create({
//               recurringId,
//               type,
//               amount,
//               date: nextTransactionDate,
//               category,
//               description,
//             });

//             console.log("Transaction Created:", transaction);
//           } catch (error) {
//             console.error("Error Creating Transaction:", error.message);
//           }
//         } else {
//           console.log("Transaction already exists for:", nextTransactionDate);
//         }
//       } else {
//         console.log("Next transaction date does not match today. Skipping.");
//       }
//     }

//     console.log("Daily Transaction Generation Completed");
//   } catch (error) {
//     console.error("Error Generating Recurring Transactions:", error.message);
//   }
// };
