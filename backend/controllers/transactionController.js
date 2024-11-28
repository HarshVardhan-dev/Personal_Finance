import Transaction from "../models/Transaction.js";
import { createObjectCsvWriter } from "csv-writer";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";

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

export const getAllTransactions = async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;

    // Build query object based on filters
    const query = {};
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (category) {
      query.category = category;
    }

    // Fetch transactions from the database
    const transactions = await Transaction.find(query).sort({ date: -1 });

    res.status(200).json({
      success: true,
      message: "Transactions fetched successfully",
      transactions,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const getSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Validate input
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Start date and end date are required.",
      });
    }

    const query = {
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    };

    const transactions = await Transaction.find(query);

    // Calculate summary
    const summary = transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === "income") {
          acc.totalIncome += transaction.amount;
        } else if (transaction.type === "expense") {
          acc.totalExpenses += transaction.amount;
        }

        // Calculate category-wise totals
        if (!acc.categoryBreakdown[transaction.category]) {
          acc.categoryBreakdown[transaction.category] = 0;
        }
        acc.categoryBreakdown[transaction.category] += transaction.amount;

        return acc;
      },
      { totalIncome: 0, totalExpenses: 0, categoryBreakdown: {} }
    );

    summary.netBalance = summary.totalIncome - summary.totalExpenses;

    res.status(200).json({
      success: true,
      message: "Summary fetched successfully",
      summary,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const getFilteredTransactions = async (req, res) => {
  try {
    const {
      type,
      category,
      minAmount,
      maxAmount,
      page = 1,
      limit = 10,
    } = req.query;

    // Build the query object
    const query = {};
    if (type) query.type = type;
    if (category) query.category = category;
    if (minAmount && maxAmount) {
      query.amount = { $gte: Number(minAmount), $lte: Number(maxAmount) };
    }

    // Pagination logic
    const skip = (Number(page) - 1) * Number(limit);

    // Fetch filtered transactions with pagination
    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Count total matching documents
    const total = await Transaction.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Filtered transactions fetched successfully",
      data: {
        transactions,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const exportTransactionsAsCSV = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build query
    const query = {};
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    // Fetch transactions
    const transactions = await Transaction.find(query);

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No transactions found for the specified filter.",
      });
    }

    // CSV data preparation
    let csvData = "ID,Type,Amount (₹),Date,Category,Description\n";
    transactions.forEach((transaction) => {
      csvData += `${transaction._id},${transaction.type},₹${
        transaction.amount
      },${transaction.date.toISOString().split("T")[0]},${
        transaction.category
      },${transaction.description}\n`;
    });

    // Set headers for CSV download
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="transactions.csv"'
    );

    // Send CSV data
    res.send(csvData);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const exportTransactionsAsPDF = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build query
    const query = {};
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    // Fetch transactions
    const transactions = await Transaction.find(query);

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No transactions found for the specified filter.",
      });
    }

    // Set headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="transactions.pdf"'
    );

    // Create PDF document
    const doc = new PDFDocument();
    doc.pipe(res);

    // Add content to PDF
    doc.fontSize(20).text("Transaction Report", { align: "center" });
    doc.moveDown();
    transactions.forEach((transaction, index) => {
      doc
        .fontSize(12)
        .text(
          `${index + 1}. ID: ${transaction._id}, Type: ${
            transaction.type
          }, Amount: ₹${transaction.amount}, Date: ${
            transaction.date.toISOString().split("T")[0]
          }, Category: ${transaction.category}, Description: ${
            transaction.description
          }`
        );
    });

    doc.end();
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
