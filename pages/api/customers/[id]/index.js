// pages/api/customer/[id].js
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { connectToDatabase } from '@/lib/db';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';

const saltRounds = 10;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/customers';
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

    // allow localhost:3001 for quick testing
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  
    // Handle preflight request
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    
  const { db } = await connectToDatabase();
  const id = req.query.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid customer ID' });
  }

  const _id = new ObjectId(id);

  if (req.method === 'GET') {
    try {
      const customer = await db.collection('customers').findOne({ _id });
      if (!customer) return res.status(404).json({ message: 'Customer not found' });
      res.status(200).json(customer);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching customer', error: error.message });
    }

  } else if (req.method === 'PUT') {
    upload(req, res, async function (err) {
      if (err) return res.status(500).json({ message: 'File upload error', error: err });

      const { name, email, phone, address, oldPassword, newPassword } = req.body;

      try {
        const existingCustomer = await db.collection('customers').findOne({ _id });
        if (!existingCustomer) return res.status(404).json({ message: 'Customer not found' });

        let updateData = { name, email, phone, address };

        if (oldPassword && newPassword) {
          const match = await bcrypt.compare(oldPassword, existingCustomer.password);
          if (!match) return res.status(400).json({ message: 'Passwords do not match' });
          const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
          updateData.password = hashedPassword;
        }

        if (req.file) {
          // delete old thumb
          if (existingCustomer.thumb && fs.existsSync(`uploads/customers/${existingCustomer.thumb}`)) {
            fs.unlinkSync(`uploads/customers/${existingCustomer.thumb}`);
          }
          updateData.thumb = req.file.filename;
        }

        await db.collection('customers').updateOne({ _id }, { $set: updateData });
        res.status(200).json({ message: 'Customer updated successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Error updating customer', error: error.message });
      }
    });

  } else if (req.method === 'DELETE') {
    try {
      const customer = await db.collection('customers').findOne({ _id });
      if (!customer) return res.status(404).json({ message: 'Customer not found' });

      if (customer.thumb && fs.existsSync(`uploads/customers/${customer.thumb}`)) {
        fs.unlinkSync(`uploads/customers/${customer.thumb}`);
      }

      await db.collection('customers').deleteOne({ _id });
      res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting customer', error: error.message });
    }

  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}