// lib/insertItems.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Item from "../../models/food.model.js"; // Ensure schema includes 'type'

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "your_fallback_uri_here";

async function insertItems() {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "restaurantDB", // adjust if different
    });

    const sampleItems = [
      {
        title: "Classic Beef Burger",
        description: "Juicy grilled beef patty with lettuce, tomato, and cheese.",
        image: "https://example.com/beef-burger.jpg",
        price: 499,
        categoryId: "681fafad3d2502e6b7e84fe4",
        type: "savoury"
      },
      {
        title: "Chicken Zinger Burger",
        description: "Crispy fried chicken fillet with spicy mayo and lettuce.",
        image: "https://example.com/zinger-burger.jpg",
        price: 449,
        categoryId: "681fafad3d2502e6b7e84fe4",
        type: "savoury"
      },
      {
        title: "Double Patty Burger",
        description: "Two beef patties stacked with cheese, onions, and sauce.",
        image: "https://example.com/double-patty.jpg",
        price: 599,
        categoryId: "681fafad3d2502e6b7e84fe4",
        type: "savoury"
      },
      {
        title: "Chocolate Lava Cake",
        description: "Warm chocolate cake with a gooey center.",
        image: "https://example.com/lava-cake.jpg",
        price: 299,
        categoryId: "681fafad3d2502e6b7e84fe5",
        type: "dessert"
      },
      {
        title: "Strawberry Cheesecake",
        description: "Creamy cheesecake with fresh strawberry topping.",
        image: "https://example.com/strawberry-cheesecake.jpg",
        price: 349,
        categoryId: "681fafad3d2502e6b7e84fe5",
        type: "dessert"
      }
    ];

    const result = await Item.insertMany(sampleItems);
    console.log("✅ Items inserted:", result);
    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Insertion error:", error);
  }
}

insertItems();
