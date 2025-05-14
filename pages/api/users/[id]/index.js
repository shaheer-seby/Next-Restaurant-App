import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

const uploadDir = 'public/uploads/users';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
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

const upload = multer({ storage }).single('thumb');

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const id = req.query.id;

 
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }


  if (req.method === 'GET') {
    try {

      const user = await db
        .collection('users')
        .findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } });
console.log(user);
      if (!user) return res.status(404).json({ message: 'User not found' });

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
  }

 
  else if (req.method === 'PUT') {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: 'File upload error', error: err.message });
      }

      try {
        const {
          name,
          email,
          phone,
          address,
          oldPassword,
          newPassword,
        } = req.body;

        const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const updateFields = {
          name,
          email,
          phone,
          address,
        };

       
        if (oldPassword && newPassword) {
          const passwordMatch = await bcrypt.compare(oldPassword, user.password);
          if (!passwordMatch) {
            return res.status(400).json({ message: 'Old password is incorrect' });
          }
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          updateFields.password = hashedPassword;
        }

        
        if (req.file) {
          updateFields.thumb = `/uploads/users/${req.file.filename}`;
        }

        await db.collection('users').updateOne(
          { _id: new ObjectId(id) },
          { $set: updateFields }
        );

        res.status(200).json({ message: 'User updated successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Update failed', error: error.message });
      }
    });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
