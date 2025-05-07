import { connectToDatabase } from "@/lib/db";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("deliverymens");

    const deliveryman = await collection.findOne({ email });

    if (!deliveryman) {
      return res.status(404).json({ message: "User not found." });
    }

    const match = await bcrypt.compare(password, deliveryman.password);
    if (!match) {
      return res.status(401).json({ message: "Incorrect email or password." });
    }

    return res.status(200).json({ deliveryman, message: "Login successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong." });
  }
}
