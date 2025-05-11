import { ObjectId } from 'mongodb'; // Import ObjectId
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
  const { id } = req.query;

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
    // Handle GET request (fetch food item by ID)
    try {
      const food = await db.collection('foods').findOne({ _id: new ObjectId(id) });
      if (!food) {
        return res.status(404).json({ message: 'Food item not found' });
      }
      res.status(200).json(food);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching food item', error: error.message });
    }
  } else if (req.method === 'PUT') {
    // Handle PUT request (update food item by ID)
    upload(req, res, async function (err) {
      if (err) {
        return res.status(500).json({ message: 'File upload error', error: err });
      }

      const { title, price, featured, active, category, description, oldThumb } = req.body;
      const updateData = {
        title,
        price: Number(price),
        featured,
        active,
        category,
        description,
      };

      if (req.file) {
        const oldThumbPath = path.join('uploads/foods', oldThumb);
        if (fs.existsSync(oldThumbPath)) {
          fs.unlinkSync(oldThumbPath); // Delete old thumbnail
        }
        updateData.thumb = req.file.filename;
      }

      try {
        const result = await db.collection('foods').updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData }
        );

        if (!result.matchedCount) {
          return res.status(404).json({ message: 'Food item not found' });
        }
        res.status(200).json({ message: 'Food item updated successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Error updating food item', error: error.message });
      }
    });
  } else if (req.method === 'DELETE') {
    // Handle DELETE request (delete food item by ID)
    try {
      const food = await db.collection('foods').findOne({ _id: new ObjectId(id) });
      if (!food) {
        return res.status(404).json({ message: 'Food item not found' });
      }

      const thumbPath = path.join('uploads/foods', food.thumb);
      if (fs.existsSync(thumbPath)) {
        fs.unlinkSync(thumbPath); // Delete food item thumbnail
      }

      await db.collection('foods').deleteOne({ _id: new ObjectId(id) });
      res.status(200).json({ message: 'Food item deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting food item', error: error.message });
    }
  } else {
    // Handle unsupported methods
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
