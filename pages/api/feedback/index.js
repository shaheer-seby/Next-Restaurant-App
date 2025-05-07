// pages/api/message/index.js
import { connectToDatabase } from '@/lib/db';

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  if (req.method === 'POST') {
    const { name, email, subject, phone, message, read } = req.body;
    try {
      await db.collection('messages').insertOne({ name, email, subject, phone, message, read });
      res.status(200).json({ message: 'Feedback added successfully.' });
    } catch (error) {
      res.status(500).json({ message: `Error: ${error.message}` });
    }
  } else if (req.method === 'GET') {
    try {
      const messages = await db.collection('messages').find().sort({ _id: -1 }).toArray();
      if (!messages) {
        res.status(404).json({ message: 'Feedbacks not found' });
      } else {
        res.status(200).json(messages);
      }
    } catch (err) {
      res.status(500).json({ message: 'An error occurred fetching feedbacks.' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
