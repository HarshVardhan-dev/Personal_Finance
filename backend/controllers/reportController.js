import Transaction from "../models/Transaction.js";

export const getCategoryWiseReport = async (req, res) => {
  try {
    const { type = "expense", startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "startDate and endDate are required fields.",
      });
    }

    // Aggregate transactions by category
    const report = await Transaction.aggregate([
      {
        $match: {
          type,
          date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          category: "$_id",
          totalAmount: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("Error Generating Category-Wise Report:", error.message);
    res.status(500).json({
      success: false,
      message: "Error generating category-wise report.",
      error: error.message,
    });
  }
};

export const getTimeSeriesReport = async (req, res) => {
  try {
    const { startDate, endDate, interval = "daily" } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "startDate and endDate are required fields.",
      });
    }

    // Define the group stage for MongoDB aggregation
    let groupStage;
    switch (interval) {
      case "weekly":
        groupStage = { $week: "$date" };
        break;
      case "monthly":
        groupStage = { $month: "$date" };
        break;
      default: // Default to daily
        groupStage = {
          $dateToString: { format: "%Y-%m-%d", date: "$date" },
        };
    }

    // Aggregate transactions grouped by interval and type
    const report = await Transaction.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: {
            interval: groupStage,
            type: "$type",
          },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $group: {
          _id: "$_id.interval",
          data: {
            $push: {
              type: "$_id.type",
              totalAmount: "$totalAmount",
            },
          },
        },
      },
      {
        $project: {
          date: "$_id",
          _id: 0,
          data: 1,
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("Error Generating Time-Series Report:", error.message);
    res.status(500).json({
      success: false,
      message: "Error generating time-series report.",
      error: error.message,
    });
  }
};
