
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import { connectToDatabase } from '@/lib/db';

const saltRounds = 10;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/customers';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const name = Date.now() + '-' + file.originalname;
    cb(null, name);
  },
});

const upload = multer({ storage: storage }).single('thumb');

export default async function handler(req, res) {
  const { db } = await connectToDatabase();


    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

  if (req.method === 'GET') {
    try {
      const customers = await db.collection('customers').find().sort({ _id: -1 }).toArray();
      res.status(200).json(customers);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching customers', error: error.message });
    }
  } else if (req.method === 'POST') {
    upload(req, res, async function (err) {
      if (err) return res.status(500).json({ message: 'File upload error', error: err });

      const { name, email, password, phone, address } = req.body;
      const emailCheck = await db.collection('customers').findOne({ email });
      if (emailCheck) {
        return res.status(400).json({ message: 'User already exists.' });
      }

      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const thumb = req.file ? req.file.filename : 'default-avatar.png';

      const newCustomer = {
        name,
        email,
        password: hashedPassword,
        thumb,
        phone,
        address,
      };

      try {
        await db.collection('customers').insertOne(newCustomer);
        res.status(200).json({ message: 'User created successfully.' });
      } catch (error) {
        res.status(500).json({ message: 'Error creating customer', error: error.message });
      }
    });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
