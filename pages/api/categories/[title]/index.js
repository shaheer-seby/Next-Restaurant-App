// pages/api/category/[title].js

import { connectToDatabase } from '@/lib/db.js';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' });

  const { title } = req.query;

  try {
    const { db } = await connectToDatabase();

    const category = await db.collection('categories').findOne({ title });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const items = await db
      .collection('items') // assuming your item collection is called 'items'
      .find({ categoryId: category._id })
      .toArray();

    res.status(200).json({ category, items });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
export const config = {
  api: {
    bodyParser: false,
  },
};
