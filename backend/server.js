import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import bodyParser from "body-parser";

// Routes Imported
import transactionRoutes from "./routes/transactions.js";

dotenv.config();
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// Routes

app.use("/api/transactions", transactionRoutes);

// MongoDB Connection
connectDB();
// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server Running on PORT ${PORT}`));
