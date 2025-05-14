import { ObjectId } from "mongodb";  
import multer from "multer";
import fs from "fs";
import path from "path";
import { connectToDatabase } from "@/lib/db"; 

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/food/");
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


    
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

  if (req.method === "GET") {

    try {
      const blog = await db.collection("blogs").findOne({ _id: new ObjectId(id) }); 
      if (!blog) {
        return res.status(404).json({ message: "Blog not found." });
      }
      res.status(200).json(blog);
    } catch (error) {
      res.status(500).json({ message: "An error occurred fetching the blog.", error: error.message });
    }
  } else if (req.method === "PUT") {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(500).json({ message: "Error uploading file", error: err.message });
    }

    try {
      const updateData = {
        title: req.body.title,
        featured: req.body.featured,
        description: req.body.description,
      };

      if (req.file) {
        const oldThumb = req.body.oldThumb;

        if (oldThumb) {
          try {
            const oldPath = path.join(process.cwd(), "public/uploads/food", oldThumb);
            fs.unlinkSync(oldPath); 
          } catch (unlinkErr) {
            console.warn("Could not delete old thumbnail:", unlinkErr.message);
          }
        }

        updateData.thumb = req.file.filename;
      }

      const result = await db.collection("blogs").updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      if (!result.matchedCount) {
        return res.status(404).json({ message: "Blog not found." });
      }

      res.status(200).json({ message: "Blog updated successfully." });
    } catch (error) {
      console.error("Update error:", error);
      return res.status(500).json({ message: "Error updating the blog.", error: error.message });
    }
  });
} else if (req.method === "DELETE") {
  try {
    const blog = await db.collection("blogs").findOne({ _id: new ObjectId(id) });
    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    
    const thumbPath = path.join(process.cwd(), "public", "uploads", "food", blog.thumb);

    try {
      fs.unlinkSync(thumbPath);
    } catch (unlinkErr) {
      console.warn("Could not delete thumbnail file:", unlinkErr.message);
    }

    await db.collection("blogs").deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({ message: "Blog deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "An error occurred deleting the blog.", error: error.message });
  }
}
else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
export const config = {
  api: {
    bodyParser: false,
  },
};
