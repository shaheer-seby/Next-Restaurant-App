import mongoose from "mongoose";
import dotenv from "dotenv";
import Messages from "../../models/message.model.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function insertMessages() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: "restaurantDB" });

    const sampleMessages = [
      {
        name: "Zain",
        email: "zain@example.com",
        subject: "Order not received",
        phone: "03121234567",
        message: "I placed an order yesterday but haven’t received it yet.",
      },
      {
        name: "Iqra",
        email: "iqra@example.com",
        subject: "Feedback",
        phone: "03001234567",
        message: "Loved the food! Great service.",
      },
    ];

    const result = await Messages.insertMany(sampleMessages);
    console.log("✅ Messages inserted:", result);
    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Insertion error:", error);
  }
}

insertMessages();
