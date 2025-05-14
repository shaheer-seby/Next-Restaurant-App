
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { id } = req.query;
  const { method } = req;

 
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format.' });
  }

  const _id = new ObjectId(id);
  const { db } = await connectToDatabase();

  switch (method) {
    case 'GET':
      try {
        const reservation = await db.collection('reservations').findOne({ _id });
        if (!reservation) {
          res.status(404).json({ message: 'Reservation not found.' });
        } else {
          res.status(200).json(reservation);
        }
      } catch (err) {
        res.status(500).json({ message: 'Error fetching reservation.' });
      }
      break;

    case 'PUT':
      try {
        const { name, email, phone, date, time, guests, notes } = req.body;
        const result = await db.collection('reservations').updateOne(
          { _id },
          { $set: { name, email, phone, date, time, guests, notes } }
        );
        if (result.matchedCount === 0) {
          res.status(404).json({ message: 'Reservation not found.' });
        } else {
          res.status(200).json({ message: 'Reservation updated successfully.' });
        }
      } catch (err) {
        res.status(500).json({ message: 'Error updating reservation.' });
      }
      break;

    case 'DELETE':
      try {
        const result = await db.collection('reservations').deleteOne({ _id });
        if (result.deletedCount === 0) {
          res.status(404).json({ message: 'Failed to delete reservation.' });
        } else {
          res.status(200).json({ message: 'Reservation deleted successfully.' });
        }
      } catch (err) {
        res.status(500).json({ message: 'Error deleting reservation.' });
      }
      break;

    default:
      res.status(405).json({ message: 'Method Not Allowed' });
  }
}
