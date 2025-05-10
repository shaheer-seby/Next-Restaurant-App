// pages/api/foods/index.js
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { connectToDatabase } from '@/lib/db';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/foods';
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

  // allow localhost:3001 for quick testing
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // Handle GET request (list food items or search)
    const { q } = req.query;

    try {
      const query = q ? { title: { $regex: q, $options: 'i' } } : {};
      const foods = await db.collection('foods').find(query).sort({ _id: -1 }).toArray();
      res.status(200).json(foods);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching food items', error: error.message });
    }
  } else if (req.method === 'POST') {
    // Handle POST request (create new food item)
    upload(req, res, async function (err) {
      if (err) {
        return res.status(500).json({ message: 'File upload error', error: err });
      }

      const { title, price, featured, active, category, description } = req.body;
      const newFood = {
        title,
        price: Number(price),
        featured,
        active,
        category,
        description,
        thumb: req.file.filename,
      };

      try {
        const result = await db.collection('foods').insertOne(newFood);
        res.status(200).json({ message: 'Food item added successfully.' });
      } catch (error) {
        res.status(500).json({ message: 'Error creating food item', error: error.message });
      }
    });
  } else {

    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
