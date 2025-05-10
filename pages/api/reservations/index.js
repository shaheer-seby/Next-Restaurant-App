// pages/api/reservations/index.js
import { connectToDatabase } from '@/lib/db';

export default async function handler(req, res) {
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

  if (req.method === 'POST') {
    const { name, email, phone, date, time, guests, notes } = req.body;
    try {
      await db.collection('reservations').insertOne({
        name, email, phone, date, time, guests, notes, createdAt: new Date(),
      });
      res.status(200).json({ message: 'Reservation added successfully.' });
    } catch (error) {
      res.status(500).json({ message: `Error: ${error.message}` });
    }
  } else if (req.method === 'GET') {
    try {
      const reservations = await db.collection('reservations').find().sort({ createdAt: -1 }).toArray();
      res.status(200).json(reservations);
    } catch (err) {
      res.status(500).json({ message: 'An error occurred fetching reservations.' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
