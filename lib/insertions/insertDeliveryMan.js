import mongoose from "mongoose";
import dotenv from "dotenv";
import DeliveryMen from "../../models/deliveryMan.model.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function insertDeliveryMen() {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "restaurantDB",
    });

    const sampleDeliveryMen = [
      {
        name: "Ali Khan",
        email: "ali@example.com",
        password: "securepassword456",
        thumb: "https://example.com/ali.jpg",
        phone: "9876543210",
        address: "456 Avenue, City",
        reviews: [],
        rating: 0,
        totalReviews: 0,
        completeOrders: 0,
        pendingOrders: 0,
      },
    ];

    const result = await DeliveryMen.insertMany(sampleDeliveryMen);
    console.log("✅ Delivery Men inserted:", result);
    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Insertion error:", error);
  }
}

insertDeliveryMen();
