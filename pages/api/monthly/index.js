import { connectToDatabase } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { db } = await connectToDatabase();

  try {
    const monthlyRevenue = await db.collection('orders').aggregate([
      { $match: { status: 'Delivered' } },
      {
        $group: {
          _id: {
            month: { $month: '$order_date' },
            year: { $year: '$order_date' },
          },
          revenue: { $sum: '$total_price' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]).toArray();

    res.status(200).json(monthlyRevenue);
  } catch (error) {
    res.status(500).json({ message: 'Error calculating monthly revenue', error: error.message });
  }
}
