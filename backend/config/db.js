import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(
      colors.green.bold(
        `✅ MongoDB Connected: ${conn.connection.host}:${conn.connection.port}`
      )
    );
  } catch (error) {
    console.error(colors.red.bold(`❌ Error: ${error.message}`));
    process.exit(1);
  }
};

export default connectDB;
