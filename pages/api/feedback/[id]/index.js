
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

   
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
  const { db } = await connectToDatabase();

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format.' });
  }

  const _id = new ObjectId(id);

  switch (method) {
    case 'GET':
      try {
        const message = await db.collection('messages').findOne({ _id });
        if (!message) {
          res.status(404).json({ message: 'Feedback not found.' });
        } else {
          res.status(200).json(message);
        }
      } catch (err) {
        res.status(500).json({ message: 'An error occurred fetching the feedback.' });
      }
      break;

    case 'PUT':
      try {
        const result = await db.collection('messages').updateOne(
          { _id },
          { $set: { read: 'Yes' } }
        );
        if (result.matchedCount === 0) {
          res.status(404).json({ message: 'Feedback not found' });
        } else {
          res.status(200).json({ message: 'Feedback status updated successfully.' });
        }
      } catch (err) {
        res.status(500).json({ message: 'An error occurred updating the feedback status.' });
      }
      break;

    case 'DELETE':
      try {
        const result = await db.collection('messages').deleteOne({ _id });
        if (result.deletedCount === 0) {
          res.status(404).json({ message: 'Failed to delete the feedback.' });
        } else {
          res.status(200).json({ message: 'Feedback deleted successfully.' });
        }
      } catch (err) {
        res.status(500).json({ message: 'An error occurred deleting the feedback.' });
      }
      break;

    default:
      res.status(405).json({ message: 'Method Not Allowed' });
  }
}