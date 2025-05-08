import { ObjectId } from "mongodb";  // Import ObjectId from mongodb
import multer from "multer";
import fs from "fs";
import path from "path";
import { connectToDatabase } from "@/lib/db"; // Your DB connection utility

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

  if (req.method === "GET") {
    // GET SINGLE BLOG
    try {
      const blog = await db.collection("blogs").findOne({ _id: new ObjectId(id) });  // Use ObjectId here
      if (!blog) {
        return res.status(404).json({ message: "Blog not found." });
      }
      res.status(200).json(blog);
    } catch (error) {
      res.status(500).json({ message: "An error occurred fetching the blog.", error: error.message });
    }
  } else if (req.method === "PUT") {
    // UPDATE BLOG
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: "Error uploading file", error: err });
      }

      try {
        const updateData = {
          title: req.body.title,
          featured: req.body.featured,
          description: req.body.description,
        };

        if (req.file) {
          const oldThumb = req.body.oldThumb;
          fs.unlinkSync(path.join("uploads/blogs", oldThumb)); // Delete old thumbnail
          updateData.thumb = req.file.filename;
        }

        const result = await db.collection("blogs").updateOne(
          { _id: new ObjectId(id) },  // Use ObjectId here
          { $set: updateData }
        );

        if (!result.matchedCount) {
          return res.status(404).json({ message: "Blog not found." });
        }

        res.status(200).json({ message: "Blog updated successfully." });
      } catch (error) {
        res.status(500).json({ message: "Error updating the blog.", error: error.message });
      }
    });
  } else if (req.method === "DELETE") {
    // DELETE BLOG
    try {
      const blog = await db.collection("blogs").findOne({ _id: new ObjectId(id) });  // Use ObjectId here
      if (!blog) {
        return res.status(404).json({ message: "Blog not found." });
      }

      const thumbPath = path.join("uploads/blogs", blog.thumb);
      fs.unlinkSync(thumbPath); // Delete the image file

      await db.collection("blogs").deleteOne({ _id: new ObjectId(id) });  // Use ObjectId here
      res.status(200).json({ message: "Blog deleted successfully." });
    } catch (error) {
      res.status(500).json({ message: "An error occurred deleting the blog.", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
