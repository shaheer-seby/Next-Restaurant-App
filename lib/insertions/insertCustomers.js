import mongoose from "mongoose";
import dotenv from "dotenv";
import Customers from "../../models/customer.model.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function insertCustomers() {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "restaurantDB",
    });

    const sampleCustomers = [
      {
        name: "Iqra Bokhari",
        email: "iqra@example.com",
        password: "hashedpassword123",
        thumb: "https://example.com/iqra.jpg",
        phone: "1234567890",
        address: "123 Street, City",
      },
    ];

    const result = await Customers.insertMany(sampleCustomers);
    console.log("✅ Customers inserted:", result);
    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Insertion error:", error);
  }
}

insertCustomers();
