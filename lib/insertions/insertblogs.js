// lib/insertBlogs.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Blogs from "../../models/blog.model.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "your_fallback_uri_here";

async function insertBlogs() {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "restaurantDB",
    });

    const sampleBlogs = [
      {
        title: "Top 10 Dishes of 2025",
        thumb: "https://example.com/thumb1.jpg",
        description: "Explore the top trending dishes this year across the globe.",
        featured: "on",
        post_by: "Chef Iqra",
        date: new Date("2025-05-10"),
      },
      {
        title: "Behind the Kitchen: Stories of Our Chefs",
        thumb: "https://example.com/thumb2.jpg",
        description: "Get to know the people who bring magic to your plate.",
        post_by: "Manager",
        date: new Date("2025-05-09"),
      }
    ];

    const result = await Blogs.insertMany(sampleBlogs);
    console.log("✅ Documents inserted:", result);
    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Insertion error:", error);
  }
}

insertBlogs();
