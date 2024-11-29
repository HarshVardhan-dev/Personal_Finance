import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import bodyParser from "body-parser";
import colors from "colors";

// Routes Imported
import transactionRoutes from "./routes/transactions.js";
import recurringTransactionRoutes from "./routes/recurringTransactions.js";

dotenv.config();
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/transactions", transactionRoutes);
app.use("/api/recurringTransactions", recurringTransactionRoutes);

// MongoDB Connection
connectDB();

// Start the Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  if (process.env.NODE_ENV === "development") {
    console.log(
      colors.green.bold(
        `🚀 Server is running in development mode with nodemon. Watching for changes...`
      )
    );
  }
  console.log(colors.magenta.bold(`🚀 Server Running on PORT ${PORT}`));
});

// Handle process termination gracefully
process.on("SIGINT", () => {
  console.log(colors.yellow.bold("\n🛑 Server is shutting down..."));
  server.close(() => {
    console.log(colors.red.bold("❌ Server has been stopped."));
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  console.log(colors.yellow.bold("\n🛑 Server received termination signal..."));
  server.close(() => {
    console.log(colors.red.bold("❌ Server has been stopped."));
    process.exit(0);
  });
});
