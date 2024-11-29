import Budget from "../models/Budget.js";
import Transaction from "../models/Transaction.js";

// Add a new budget
export const addBudget = async (req, res) => {
  try {
    const { category, amount, timePeriod, startDate, endDate } = req.body;

    // Validate overlapping budgets
    const overlappingBudget = await Budget.findOne({
      category,
      timePeriod,
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) },
        },
      ],
    });

    if (overlappingBudget) {
      return res.status(400).json({
        success: false,
        message: "A budget already exists for this category and time period.",
      });
    }

    // Create and save the new budget
    const budget = await Budget.create({
      category,
      amount,
      timePeriod,
      startDate,
      endDate,
    });

    res.status(201).json({
      success: true,
      message: "Budget added successfully.",
      budget,
    });
  } catch (error) {
    console.error("Error Adding Budget:", error.message);
    res.status(500).json({
      success: false,
      message: "Error adding budget.",
      error: error.message,
    });
  }
};

export const compareActualVsBudgeted = async (req, res) => {
  try {
    const { category, timePeriod, startDate, endDate } = req.query;

    if (!timePeriod || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "timePeriod, startDate, and endDate are required fields.",
      });
    }

    const filter = { timePeriod };
    if (category) filter.category = category;

    // Fetch budgets for the given category and time period
    const budgets = await Budget.find(filter);

    if (!budgets.length) {
      return res.status(404).json({
        success: false,
        message: "No budgets found for the specified category and time period.",
      });
    }

    // Prepare comparison data
    const comparisonData = [];

    for (const budget of budgets) {
      const {
        category,
        amount: budgetedAmount,
        startDate: budgetStartDate,
        endDate: budgetEndDate,
      } = budget;

      // Fetch actual transactions for the budget's category and date range
      const actualAmount = await Transaction.aggregate([
        {
          $match: {
            category,
            date: {
              $gte: new Date(
                Math.max(new Date(startDate), new Date(budgetStartDate))
              ),
              $lte: new Date(
                Math.min(new Date(endDate), new Date(budgetEndDate))
              ),
            },
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$amount" },
          },
        },
      ]);

      comparisonData.push({
        category,
        budgetedAmount,
        actualAmount: actualAmount[0]?.totalAmount || 0,
        difference: budgetedAmount - (actualAmount[0]?.totalAmount || 0),
      });
    }

    res.status(200).json({
      success: true,
      data: comparisonData,
    });
  } catch (error) {
    console.error("Error Comparing Actual vs Budgeted:", error.message);
    res.status(500).json({
      success: false,
      message: "Error comparing actual vs budgeted.",
      error: error.message,
    });
  }
};

export const getOverspendingAlerts = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for comparison

    // Fetch active budgets
    const budgets = await Budget.find({
      endDate: { $gte: today },
    });

    if (!budgets.length) {
      return res.status(404).json({
        success: false,
        message: "No active budgets found.",
      });
    }

    // Prepare overspending data
    const alerts = [];

    for (const budget of budgets) {
      const { category, amount: budgetedAmount, startDate, endDate } = budget;

      // Fetch actual expenses for the budget's category and date range
      const actualAmount = await Transaction.aggregate([
        {
          $match: {
            category,
            date: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$amount" },
          },
        },
      ]);

      const totalActual = actualAmount[0]?.totalAmount || 0;
      const difference = budgetedAmount - totalActual;

      // If overspending, add to alerts
      if (difference < 0) {
        alerts.push({
          category,
          budgetedAmount,
          actualAmount: totalActual,
          difference,
        });
      }
    }

    res.status(200).json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    console.error("Error Fetching Overspending Alerts:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching overspending alerts.",
      error: error.message,
    });
  }
};
