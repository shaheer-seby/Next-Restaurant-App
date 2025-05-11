import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password, name, address, phone } = req.body;

    if (!email || !password || !name || !address || !phone) {
      return res.status(200).json({ message: 'Missing required fields.' });
    }

    let client;

    try {
      client = await MongoClient.connect(process.env.MONGODB_URI);
    } catch (error) {
      return res.status(200).json({ message: 'Database connection failed.' });
    }

    const db = client.db();

    const existingUser = await db.collection("users").findOne({ email });

    if (existingUser) {
      client.close();
      return res.status(200).json({ message: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12); // 12 salt rounds

    await db.collection("users").insertOne({
      email,
      password: hashedPassword,
      username: name,
      phone,
      address,
      createdAt: new Date()
    });

    client.close();
    return res.status(200).json({ message: "User created successfully." });
  }

  res.status(200).json({ message: 'Method not allowed.' });
}
