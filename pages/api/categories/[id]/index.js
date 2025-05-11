import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { ObjectId } from 'mongodb'; // Import ObjectId for MongoDB
import { connectToDatabase } from '@/lib/db'; // Adjust path if necessary

// Multer setup for file storage
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

const upload = multer({ storage: storage }).single('thumb'); // Handle single file upload

export default async function handler(req, res) {
  const { client, db } = await connectToDatabase(); // Connect to DB
  const { id } = req.query; // Get category ID from query


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
    // Get single category by ID
    try {
      const category = await db.collection('categories').findOne({ _id: new ObjectId(id) });
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching category', error: error.message });
    }
  } else if (req.method === 'PUT') {
    // Update category
    upload(req, res, async function (err) {
      if (err) {
        return res.status(500).json({ message: 'File upload error', error: err });
      }

      try {
        const updateData = {
          title: req.body.title,
          featured: req.body.featured,
          active: req.body.active,
        };

        // If there's a new thumbnail, handle file deletion and update the thumb
        if (req.file) {
          const oldThumb = req.body.oldThumb;  // old thumb passed in the request
          if (oldThumb) {
            // Delete the old thumbnail
            fs.unlinkSync(path.join('uploads/categories', oldThumb));
          }
          updateData.thumb = req.file.filename;
        }

        const result = await db.collection('items').updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData }
        );

        if (!result.matchedCount) {
          return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category updated successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Error updating category', error: error.message });
      }
    });
  } else if (req.method === 'DELETE') {
    // Delete category
    try {
      const category = await db.collection('items').findOne({ _id: new ObjectId(id) });
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      // Delete the thumbnail file from disk
      const thumbPath = path.join('uploads/categories', category.thumb);
      if (fs.existsSync(thumbPath)) {
        fs.unlinkSync(thumbPath);
      }

      await db.collection('items').deleteOne({ _id: new ObjectId(id) });
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting category', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' }); // Handle unsupported methods
  }
}
