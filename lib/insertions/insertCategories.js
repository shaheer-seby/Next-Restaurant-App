import mongoose from "mongoose";
import dotenv from "dotenv";
import Categories from "../../models/category.model.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function insertCategories() {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "restaurantDB",
    });

    const sampleCategories = [
      {
        title: "Burgers",
        thumb: "https://example.com/burger.jpg",
        featured: "on",
        active: "on",
        date: new Date("2025-05-10"),
      },
      {
        title: "Desserts",
        thumb: "https://example.com/dessert.jpg",
        featured: "off",
        active: "on",
      },
    ];

    const result = await Categories.insertMany(sampleCategories);
    console.log("✅ Categories inserted:", result);
    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Insertion error:", error);
  }
}

insertCategories();
