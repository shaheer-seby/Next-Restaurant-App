// models/categoryitem.model.js (unified model for foods)
import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Customers",
  },
  date: { type: Date, default: Date.now },
});

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String }, // Optional: Can also be called "thumb"
  price: { type: Number, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Categories", required: true },
  type: { type: String, enum: ["savoury", "dessert"], required: true },
  featured: { type: String, default: "off" },
  active: { type: String, default: "off" },
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
});

// Reuse schema but store in "foods" collection
const Item = mongoose.models.Item || mongoose.model("foodItems", itemSchema, "foods");
export default Item;
