import mongoose from "mongoose";
import dotenv from "dotenv";
import Users from "../../models/user.model.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function insertUsers() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: "restaurantDB" });

    const sampleUsers = [
      {
        name: "Admin",
        username: "admin",
        email: "admin@restaurant.com",
        password: "admin123",
        thumb: "https://example.com/admin.jpg",
        phone: "03009998888",
        position: "Manager",
        address: "Office HQ, Lahore",
      },
    ];

    const result = await Users.insertMany(sampleUsers);
    console.log("✅ Users inserted:", result);
    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Insertion error:", error);
  }
}

insertUsers();
