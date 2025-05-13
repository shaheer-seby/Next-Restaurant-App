import { connectToDatabase } from '@/lib/db.js';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { title } = req.query;

  if (!title) {
    return res.status(400).json({ message: 'Missing category title' });
  }

  try {
    const { db } = await connectToDatabase();

    if (req.method === 'GET') {
      const category = await db.collection('categories').findOne({ title });

      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      const items = await db
        .collection('items')
        .find({ categoryId: category._id })
        .toArray();

      return res.status(200).json({ category, items });
    }

    if (req.method === 'DELETE') {
      const category = await db.collection('categories').findOne({ title });
console.log('Category:', category);
console.log('Category Title:', title);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      // Delete the category image (thumb)
      if (category.thumb) {
        const imagePath = path.join(process.cwd(), 'public', 'uploads', 'food', category.thumb);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      // Delete all foods with type === category.title
      const foodsToDelete = await db.collection('foods').find({ type: title }).toArray();

      for (const food of foodsToDelete) {
        if (food.thumb) {
          const foodImagePath = path.join(process.cwd(), 'public', 'uploads', 'food', food.thumb);
          if (fs.existsSync(foodImagePath)) {
            fs.unlinkSync(foodImagePath);
          }
        }
      }

      await db.collection('foods').deleteMany({ type: title });

      // Delete the category
      await db.collection('categories').deleteOne({ title });

      return res.status(200).json({ message: 'Category and associated foods deleted successfully' });
    }

    res.setHeader('Allow', ['GET', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
