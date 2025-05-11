import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  thumb: { type: String },
});

// ✅ Only create the model if it doesn't already exist
const Category = mongoose.models.Categories || mongoose.model("Categories", categorySchema);

export default Category;
