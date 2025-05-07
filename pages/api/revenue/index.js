// pages/api/orders/index.js
import { connectToDatabase } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { db } = await connectToDatabase();

  try {
    const result = await db.collection('orders').aggregate([
      {
        $match: { status: 'Delivered' },
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: '$total_price' },
        },
      },
    ]).toArray();

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching revenue data', error: error.message });
  }
}
