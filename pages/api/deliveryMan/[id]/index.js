import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  const { db } = await connectToDatabase();
  const collection = db.collection("deliverymens");

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  const _id = new ObjectId(id);

  switch (method) {
    case "GET":
      try {
        const deliveryMan = await collection.findOne({ _id });
        if (!deliveryMan) {
          return res.status(404).json({ message: "Delivery boy not found" });
        }
        return res.status(200).json(deliveryMan);
      } catch (error) {
        return res.status(500).json({ message: "Error fetching delivery boy" });
      }

    case "PUT":
      // This version assumes that req.body is already parsed (e.g. JSON, not multipart)
      try {
        const body = req.body;

        if (body.passwordUpdate) {
          const bcrypt = await import("bcrypt");
          const deliveryMan = await collection.findOne({ _id });

          const isMatch = await bcrypt.compare(body.oldPassword, deliveryMan.password);
          if (!isMatch) return res.status(400).json({ message: "Old password incorrect" });

          const hash = await bcrypt.hash(body.newPassword, 10);
          await collection.updateOne({ _id }, { $set: { password: hash } });
          return res.status(200).json({ message: "Password updated successfully" });
        } else if (body.thumbUpdate) {
          const oldThumb = body.oldThumb;
          const newThumb = body.newThumb;

          if (oldThumb && fs.existsSync(`uploads/delivery-men/${oldThumb}`)) {
            fs.unlinkSync(`uploads/delivery-men/${oldThumb}`);
          }

          await collection.updateOne({ _id }, { $set: { ...body, thumb: newThumb } });
          return res.status(200).json({ message: "Image updated successfully" });
        } else {
          await collection.updateOne({ _id }, { $set: body });
          return res.status(200).json({ message: "Delivery boy updated successfully" });
        }
      } catch (error) {
        return res.status(500).json({ message: "Error updating delivery boy" });
      }

    case "DELETE":
      try {
        const { thumb } = req.query;

        if (thumb && fs.existsSync(`uploads/delivery-men/${thumb}`)) {
          fs.unlinkSync(`uploads/delivery-men/${thumb}`);
        }

        const result = await collection.deleteOne({ _id });
        if (!result.deletedCount) {
          return res.status(404).json({ message: "Delivery boy not found" });
        }
        return res.status(200).json({ message: "Deleted successfully" });
      } catch (error) {
        return res.status(500).json({ message: "Error deleting delivery boy" });
      }

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
