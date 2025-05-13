import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const orders = await db.collection('orders').find().sort({ _id: -1 }).toArray();
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
  }

  else if (req.method === 'POST') {
    try {
      console.log('Request body inside post orders:', req.body);
      const { items, customer_id, name, email, address, phone } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Invalid order items.' });
      }

      const total_quantity = items.reduce((sum, item) => sum + item.quantity, 0);
      const total_price = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

      const order = {
        orderID: `ORD-${Date.now()}`,
        customer_id: customer_id || null,
        customer_name: name || 'Guest',
        items,
        total_foods: items.length,
        total_quantity,
        deliveryCost: 0,
        total_price,
        email: email || null,
        phone: phone || null,
        city: null,
        address: address || null,
        payment: 'Stripe',
        thumb: null,
        createdAt: new Date()
      };

      const result = await db.collection('orders').insertOne(order);

      // Return the order ID for frontend to fetch later
      res.status(201).json({
        message: 'Order placed successfully.',
        orderId: result.insertedId.toString(), // make sure it's string for fetch
      });

    } catch (error) {
      res.status(500).json({ message: `Error placing order`, error: error.message });
    }
  }

  else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
