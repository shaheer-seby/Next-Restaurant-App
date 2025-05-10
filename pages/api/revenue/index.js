// pages/api/orders/index.js
import { connectToDatabase } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { db } = await connectToDatabase();

    // allow localhost:3001 for quick testing
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  
    // Handle preflight request
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

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
