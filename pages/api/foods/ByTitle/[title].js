

import { connectToDatabase } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { title } = req.query;

  try {
    const { db } = await connectToDatabase();

    const items = await db
      .collection('foods')
      .find({ type: title }) 
      .toArray();

    if (items.length === 0) {
      return res.status(404).json({ message: 'No items found in this category' });
    }

    res.status(200).json({ category: title, items });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
