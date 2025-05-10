import { connectToDatabase } from '../../../lib/db';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/categories';
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
  const { client, db } = await connectToDatabase();

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
    // Handle file upload and create a new category
    upload(req, res, async function (err) {
      if (err) {
        return res.status(500).json({ message: 'File upload error', error: err });
      }

      try {
        const newCategory = {
          title: req.body.title,
          thumb: req.file.filename,
          featured: req.body.featured,
          active: req.body.active,
        };
        
        const result = await db.collection('categories').insertOne(newCategory);
        res.status(201).json({ message: 'Category added successfully', category: result.ops[0] });
      } catch (error) {
        res.status(500).json({ message: `Error: ${error.message}` });
      }
    });
  } else if (req.method === 'GET') {
    // Get all categories
    try {
      const categories = await db.collection('categories').find().sort({ _id: -1 }).toArray();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
