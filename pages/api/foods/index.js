import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { connectToDatabase } from '@/lib/db';
import { stripe } from '../../../lib/stripe';

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

  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const { q } = req.query;

    try {
      const query = q ? { title: { $regex: q, $options: 'i' } } : {};
      const foods = await db.collection('foods').find(query).sort({ _id: -1 }).toArray();
      res.status(200).json(foods);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching food items', error: error.message });
    }
  } else if (req.method === 'POST') {
    upload(req, res, async function (err) {
      if (err) {
        return res.status(500).json({ message: 'File upload error', error: err });
      }
    
      const { title, price, featured, active, type, description } = req.body;
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const product = await stripe.products.create({
      name: title,
    default_price_data : 
{unit_amount: price * 100,
currency: 'pkr'},
    images: ['none'] //add imgurl
    });
      const newFood = {
        title,
        price: Number(price),
        prod_id : product.id,
       featured: featured === 'on' ? 'on' : 'off',
active: active === 'on' ? 'on' : 'off',


        type,
        description,
        thumb: req.file?.filename || '',
      };

      try {
        await db.collection('foods').insertOne(newFood);
        res.status(200).json({ message: 'Food item added successfully.' });
      } catch (error) {
        res.status(500).json({ message: 'Error creating food item', error: error.message });
      }
    });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

// 👇 Needed for multer to work in Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};
