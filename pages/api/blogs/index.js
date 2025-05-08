import multer from "multer";
import fs from "fs";
import path from "path";
import { connectToDatabase } from "@/lib/db"; // Make sure this is set up to handle DB connection

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/blogs/");
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});

const upload = multer({ storage: storage }).single("thumb");

export default async function handler(req, res) {
  const { db } = await connectToDatabase();


    // allow localhost:3001 for quicl testing
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  
    // Handle preflight request
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

  if (req.method === "POST") {
    // CREATE BLOG
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: "Error uploading file", error: err });
      }

      try {
        const { title, featured, description } = req.body;
        const thumb = req.file.filename;
        
        const newBlog = {
          title,
          thumb,
          featured,
          description,
        };
        
        await db.collection("blogs").insertOne(newBlog);
        res.status(201).json({ message: "Blog added successfully." });
      } catch (error) {
        res.status(500).json({ message: `Error: ${error.message}` });
      }
    });
  } else if (req.method === "GET") {
    // GET ALL BLOGS
    try {
      const blogs = await db.collection("blogs").find().sort({ _id: -1 }).toArray();
      if (!blogs.length) {
        return res.status(404).json({ message: "Blogs not found." });
      }
      res.status(200).json(blogs);
    } catch (error) {
      res.status(500).json({ message: "An error occurred fetching blogs.", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
