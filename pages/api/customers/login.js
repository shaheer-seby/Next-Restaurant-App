import { connectToDatabase } from '@/lib/db';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {

    // allow localhost:3001 for quick testing
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }


  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  try {
    const { db } = await connectToDatabase();
    const customer = await db.collection('customers').findOne({ email });

    if (!customer) {
      return res.status(404).json({ message: 'User does not exist.' });
    }

    const match = await bcrypt.compare(password, customer.password);
    if (match) {
      res.status(200).json({ customer, message: 'Login successfully.' });
    } else {
      res.status(401).json({ message: 'Incorrect email or password.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Login error', error: error.message });
  }
}
