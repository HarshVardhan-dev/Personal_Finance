import Transaction from "../models/Transaction.js";

export const searchTransactions = async (req, res) => {
  try {
    const {
      type,
      category,
      minAmount,
      maxAmount,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    // Add filters based on query parameters
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = parseFloat(minAmount);
      if (maxAmount) filter.amount.$lte = parseFloat(maxAmount);
    }
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Fetch filtered transactions with pagination
    const transactions = await Transaction.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ date: -1 }); // Sort by most recent

    // Count total results for pagination
    const totalResults = await Transaction.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: transactions,
      pagination: {
        totalResults,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalResults / limit),
      },
    });
  } catch (error) {
    console.error("Error Searching Transactions:", error.message);
    res.status(500).json({
      success: false,
      message: "Error searching transactions.",
      error: error.message,
    });
  }
};
