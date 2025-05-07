// pages/api/users/[id].js

import { ObjectId } from 'mongodb';
import multer from 'multer';
import fs from 'fs';
import { connectToDatabase } from '@/lib/db';
import bcrypt from 'bcrypt';
import path from 'path';

const saltRounds = 10;

// Multer storage configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/users';
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
  const { id } = req.query;

  if (req.method === 'GET') {
    // Fetch user by ID
    try {
      const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
  } else if (req.method === 'PUT') {
    // Update user by ID
    upload(req, res, async function (err) {
      if (err) {
        return res.status(500).json({ message: 'File upload error', error: err });
      }

      const { name, username, email, phone, position, address, oldPassword, newPassword, thumb } = req.body;

      if (oldPassword && newPassword) {
        // Password update logic
        const user = await db.collection('users').findOne({ email });
        if (user) {
          bcrypt.compare(oldPassword, user.password, async (err, result) => {
            if (result) {
              bcrypt.hash(newPassword, saltRounds, async (err, hash) => {
                await db.collection('users').updateOne(
                  { _id: new ObjectId(id) },
                  { $set: { password: hash } }
                );
                res.status(200).json({ message: 'Password updated successfully.' });
              });
            } else {
              res.status(400).json({ message: 'Old password is incorrect.' });
            }
          });
        } else {
          res.status(404).json({ message: 'User not found.' });
        }
      } else {
        // Profile update logic
        const updateData = {
          name,
          username,
          email,
          phone,
          position,
          address,
        };

        if (req.file) {
          const oldThumb = thumb;
          const oldThumbPath = path.join('uploads/users', oldThumb);
          if (fs.existsSync(oldThumbPath)) {
            fs.unlinkSync(oldThumbPath); // Delete old thumb image
          }
          updateData.thumb = req.file.filename;
        }

        try {
          await db.collection('users').updateOne({ _id: new ObjectId(id) }, { $set: updateData });
          res.status(200).json({ message: 'User updated successfully.' });
        } catch (error) {
          res.status(500).json({ message: 'Error updating user', error: error.message });
        }
      }
    });
  } else if (req.method === 'DELETE') {
    // Delete user by ID
    try {
      const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      const thumbPath = path.join('uploads/users', user.thumb);
      if (fs.existsSync(thumbPath)) {
        fs.unlinkSync(thumbPath); // Delete user's thumbnail
      }

      await db.collection('users').deleteOne({ _id: new ObjectId(id) });
      res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
