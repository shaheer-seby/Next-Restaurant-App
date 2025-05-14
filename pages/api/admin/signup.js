import { connectToDatabase } from '@/lib/db';
import bcrypt from 'bcrypt';

const saltRounds = 10;

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

    
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

  if (req.method === 'POST') {
    const { name, username, email, password, phone, position, address } = req.body;

    try {
     
      const existingUser = await db.collection('users').findOne({ email });

      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email.' });
      }

     
      bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ message: 'Error hashing password', error: err.message });
        }

     
        const newUser = {
          name,
          username,
          email,
          password: hashedPassword,
          phone,
          position,
          address,
          role: 'admin', 
        };

        try {
         
          await db.collection('users').insertOne(newUser);
          res.status(200).json({ message: 'Admin created successfully.' });
        } catch (insertError) {
          res.status(500).json({ message: 'Error creating user', error: insertError.message });
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error occurred while creating admin user', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
