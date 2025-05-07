import { connectToDatabase } from '@/lib/db';
import bcrypt from 'bcrypt';

const saltRounds = 10;

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  if (req.method === 'POST') {
    const { name, username, email, password, phone, position, address } = req.body;

    try {
      // Check if user already exists
      const existingUser = await db.collection('users').findOne({ email });

      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email.' });
      }

      // Hash the password
      bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ message: 'Error hashing password', error: err.message });
        }

        // Create new user
        const newUser = {
          name,
          username,
          email,
          password: hashedPassword,
          phone,
          position,
          address,
          role: 'admin', // You can set a role for this user as 'admin'
        };

        try {
          // Insert new user into the database
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
