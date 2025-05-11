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
        phone: "9876543210",
        address: "456 Avenue, City",
        
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
