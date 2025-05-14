import { ObjectId } from 'mongodb'; 
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { connectToDatabase } from '@/lib/db';

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

export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const { id } = req.query; 

   
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  
   
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

  if (req.method === 'GET') {
   
    try {
      const order = await db.collection('orders').findOne({ _id: new ObjectId(id) });
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching order', error: error.message });
    }
  } else if (req.method === 'PUT') {
   
    upload(req, res, async function (err) {
      if (err) {
        return res.status(500).json({ message: 'File upload error', error: err.message });
      }

      const { orderID, customer_id, customer_name, items, total_foods, total_quantity, deliveryCost, total_price, email, phone, city, address, payment, oldThumb } = req.body;

      const updateData = {
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
      };

      if (req.file) {
        const oldThumbPath = path.join('uploads/orders', oldThumb);
        if (fs.existsSync(oldThumbPath)) {
          fs.unlinkSync(oldThumbPath); 
        }
        updateData.thumb = req.file.filename;
      }

      try {
        const result = await db.collection('orders').updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData }
        );

        if (!result.matchedCount) {
          return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order updated successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Error updating order', error: error.message });
      }
    });
  } else if (req.method === 'DELETE') {
 
  try {
    const order = await db.collection('orders').findOne({ _id: new ObjectId(id) });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

   
    if (order.thumb) {
      const thumbPath = path.join('uploads/orders', order.thumb);
      if (fs.existsSync(thumbPath)) {
        fs.unlinkSync(thumbPath);
      }
    }

    await db.collection('orders').deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error: error.message });
  }
}
else {
    
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
