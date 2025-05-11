import { connectToDatabase } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { db } = await connectToDatabase();

  try {
    const totalOrders = await db.collection('orders').countDocuments();

    const revenueData = await db.collection('orders').aggregate([
      { $match: { status: { $in: ['Delivered', 'Completed'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$total_price' } } },
    ]).toArray();
    const revenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    const totalFoods = await db.collection('foods').countDocuments();
    const totalCategories = await db.collection('categories').countDocuments();
    const totalBlogs = await db.collection('blogs').countDocuments();
    const totalCustomers = await db.collection('customers').countDocuments();
    const totalDeliveryRiders = await db.collection('deliverymen').countDocuments();
    const totalManagers = await db.collection('users').countDocuments();
    const totalMessages = await db.collection('messages').countDocuments();

    res.status(200).json({
      totalOrders,
      revenue,
      totalFoods,
      totalCategories,
      totalBlogs,
      totalCustomers,
      totalDeliveryRiders,
      totalManagers,
      totalMessages,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard statistics', error: error.message });
  }
}
