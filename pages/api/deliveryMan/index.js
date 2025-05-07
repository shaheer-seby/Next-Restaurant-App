// File: /pages/api/delivery-men/index.js
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

const saltRounds = 10;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/delivery-men';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage }).single('thumb');

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const deliveryMen = await db.collection('deliverymens').find().sort({ _id: -1 }).toArray();
      res.status(200).json(deliveryMen);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch delivery men.' });
    }
  } else if (req.method === 'POST') {
    upload(req, res, async function (err) {
      if (err) return res.status(500).json({ message: 'Upload failed', error: err });

      try {
        const { name, email, phone, address } = req.body;
        const existing = await db.collection('deliverymens').findOne({ email });

        if (existing) return res.status(400).json({ message: 'Delivery boy already exists.' });

        const avatar = Date.now() + '-avatar.png';
        const defaultPath = 'uploads/default/avatar.png';
        const copyPath = `uploads/delivery-men/${avatar}`;
        fs.copyFileSync(defaultPath, copyPath);

        const hash = await bcrypt.hash('admin', saltRounds);

        const newDeliveryMan = {
          name,
          email,
          password: hash,
          thumb: avatar,
          phone,
          address,
          reviews: [],
          rating: 0,
          totalReviews: 0,
        };

        await db.collection('deliverymens').insertOne(newDeliveryMan);
        res.status(200).json({ message: 'Delivery boy registered successfully.' });
      } catch (error) {
        res.status(500).json({ message: 'Registration failed.', error: error.message });
      }
    });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
