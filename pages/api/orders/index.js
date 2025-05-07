// pages/api/orders/index.js
import { connectToDatabase } from '@/lib/db';
import multer from 'multer';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/orders';
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

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const orders = await db.collection('orders').find().sort({ _id: -1 }).toArray();
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
  } else if (req.method === 'POST') {
    upload(req, res, async function (err) {
      if (err) {
        return res.status(500).json({ message: 'File upload error', error: err.message });
      }

      const {
        orderID, customer_id, customer_name, items,
        total_foods, total_quantity, deliveryCost,
        total_price, email, phone, city, address, payment
      } = req.body;

      const newOrder = {
        orderID,
        customer_id,
        customer_name,
        items: JSON.parse(items),
        total_foods: Number(total_foods),
        total_quantity: Number(total_quantity),
        deliveryCost: Number(deliveryCost),
        total_price: Number(total_price),
        email,
        phone,
        city,
        address,
        payment,
        thumb: req.file?.filename || null
      };

      try {
        await db.collection('orders').insertOne(newOrder);
        res.status(200).json({ message: 'Order placed successfully.' });
      } catch (error) {
        res.status(500).json({ message: `Error: ${error.message}` });
      }
    });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
