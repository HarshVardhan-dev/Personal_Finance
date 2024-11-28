import Transaction from "../models/Transaction.js";

// Add a new transaction
export const addTransaction = async (req, res) => {
  try {
    const { type, amount, date, category, description } = req.body;

    // Validate required fields
    if (!type || !amount || !date || !category) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled.",
      });
    }

    const transaction = new Transaction({
      type,
      amount,
      date,
      category,
      description,
    });
    await transaction.save();

    res.status(201).json({
      success: true,
      message: "Transaction added successfully",
      transaction,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const editTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate input
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Transaction ID is required." });
    }

    const transaction = await Transaction.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation rules are applied
    });

    if (!transaction) {
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found." });
    }

    res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      transaction,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate input
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Transaction ID is required." });
    }

    const transaction = await Transaction.findByIdAndDelete(id);

    if (!transaction) {
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found." });
    }

    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
