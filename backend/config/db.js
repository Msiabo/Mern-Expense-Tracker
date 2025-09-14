// backend/config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  console.log("🔍 Attempting MongoDB connection...");

  // Mask credentials in logs
  const safeURI = process.env.DATABASE_URL
    ? process.env.DATABASE_URL.replace(/\/\/.*@/, "//<hidden>@")
    : "❌ DATABASE_URL not set";

  console.log("🔗 DB URI:", safeURI);

  try {
    mongoose.set("debug", true); // ✅ Log all MongoDB queries

    const conn = await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10s timeout
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error (message):", error.message);
    console.error("🔎 Full error object:", error);
    process.exit(1); // Exit process if DB fails
  }

  // 🔔 Setup mongoose connection events for better debugging
  mongoose.connection.on("connected", () => {
    console.log("✅ Mongoose event: Connected to DB");
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ Mongoose event: Connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ Mongoose event: Disconnected from DB");
  });
};

module.exports = connectDB;
