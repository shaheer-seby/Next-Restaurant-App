import { connectToDatabase } from '@/lib/db';
import multer from 'multer';
import fs from 'fs';
import path from 'path';


export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'food');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {

  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { db } = await connectToDatabase();

  if (req.method === 'POST') {
    try {
      await runMiddleware(req, res, upload.single('thumb'));

      const { title, featured, active } = req.body;

      if (!title || !req.file) {
        return res.status(400).json({ message: 'Title and thumbnail are required.' });
      }

      const newCategory = {
        title,
        thumb: req.file.filename,
        featured: featured === 'on' ? 'on' : 'off',
active: active === 'on' ? 'on' : 'off',

      };

      const result = await db.collection('categories').insertOne(newCategory);
      return res.status(201).json({ message: 'Category added successfully', category: result.ops?.[0] || newCategory });
    } catch (error) {
      console.error('Error in POST /api/categories:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  if (req.method === 'GET') {
    try {
      const categories = await db.collection('categories').find().sort({ _id: -1 }).toArray();
      return res.status(200).json(categories);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
