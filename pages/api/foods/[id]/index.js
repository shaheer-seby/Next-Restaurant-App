import { ObjectId } from 'mongodb';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { connectToDatabase } from '@/lib/db';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'public/uploads/foods';
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
    bodyParser: false, // Required for multer
  },
};

export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const { id } = req.query;

  // Allow CORS (optional for dev)
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight
  if (req.method === 'OPTIONS') return res.status(200).end();

  // --- GET (Fetch food by ID) ---
  if (req.method === 'GET') {
    try {
      const food = await db.collection('foods').findOne({ _id: new ObjectId(id) });
      if (!food) return res.status(404).json({ message: 'Food item not found' });
      return res.status(200).json(food);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching food item', error: error.message });
    }
  }

  // --- PUT (Update food item) ---
  if (req.method === 'PUT') {
    upload(req, res, async function (err) {
      if (err) {
        return res.status(500).json({ message: 'File upload error', error: err.message });
      }

      try {
        const { title, price, featured, active, type, description, oldThumb } = req.body;

        const updateData = {
          title,
          price: Number(price),
          featured: featured === 'on' ? 'on' : 'off',
          active: active === 'on' ? 'on' : 'off',
          type,
          description,
        };

        if (req.file) {
          const oldThumbPath = path.join('public/uploads/foods', oldThumb);
          if (fs.existsSync(oldThumbPath)) {
            fs.unlinkSync(oldThumbPath); // Delete old image
          }
          updateData.thumb = req.file.filename;
        }

        const result = await db.collection('foods').updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData }
        );

        if (!result.matchedCount) {
          return res.status(404).json({ message: 'Food item not found' });
        }

        return res.status(200).json({ message: 'Food item updated successfully' });
      } catch (error) {
        return res.status(500).json({ message: 'Update error', error: error.message });
      }
    });
    return;
  }

  // --- DELETE (Delete category & related foods) ---
  if (req.method === 'DELETE') {
    try {
      const category = await db.collection('categories').findOne({ _id: new ObjectId(id) });

      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      const categoryTitle = category.title;
      console.log('Category Title:', categoryTitle);

      await db.collection('categories').deleteOne({ _id: new ObjectId(id) });
      const deleteResult = await db.collection('foods').deleteMany({ type: categoryTitle });

      return res.status(200).json({
        message: `Category and ${deleteResult.deletedCount} associated food items deleted.`,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Delete error', error: error.message });
    }
  }

  // --- Method Not Allowed ---
  return res.status(405).json({ message: 'Method Not Allowed' });
}
