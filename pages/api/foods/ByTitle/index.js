// pages/api/category/[title].js

import { connectToDatabase } from '@/lib/db.js';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' });

  const { title } = req.query;

  try {
    const { db } = await connectToDatabase();

    const foods = await db.collection('foods').findOne({ title });

    if (!foods) {
      return res.status(404).json({ message: 'foods not found' });
    }

    const items = await db
      .collection('foods') // assuming your item collection is called 'items'
      .find({ foodId: foods._id })
      .toArray();

    res.status(200).json({ category, foods });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
