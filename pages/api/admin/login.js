import { connectToDatabase } from '@/lib/db';
import bcrypt from 'bcrypt';

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
    const { email, password } = req.body;

    try {
      const user = await db.collection('users').findOne({ email });

      if (user) {
        bcrypt.compare(password, user.password, (err, result) => {
          if (result === true) {
            res.status(200).json({ user, message: 'Login successfully.' });
          } else {
            res.status(401).json({ message: 'Incorrect email or password.' });
          }
        });
      } else {
        res.status(404).json({ message: 'User does not exist.' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error occurred while logging in', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
