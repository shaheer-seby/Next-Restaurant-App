const mongoose = require("mongoose");
require("dotenv").config(); // <-- MUST come before using process.env

require("../../models/blog.model");
require("../../models/category.model");
require("../../models/customer.model");
require("../../models/deliveryMan.model");
require("../../models/food.model");
require("../../models/message.model");
require("../../models/order.model");
require("../../models/user.model");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
};

connectDB();
