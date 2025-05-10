import mongoose from "mongoose";
import dotenv from "dotenv";
import Foods from "../../models/food.model.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function insertFoods() {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "restaurantDB",
    });

    const sampleFoods = [
      {
        title: "Cheese Burger",
        thumb: "https://example.com/cheeseburger.jpg",
        price: 399,
        description: "Juicy cheese burger with lettuce and tomato",
        category: "Burgers",
        featured: "on",
        active: "on",
        reviews: [],
        rating: 0,
        totalReviews: 0,
      },
    ];

    const result = await Foods.insertMany(sampleFoods);
    console.log("✅ Foods inserted:", result);
    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Insertion error:", error);
  }
}

insertFoods();
