import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password, name, phone, address } = req.body;

    if (!email || !password || !name || !phone || !address) {
      res.status(422).json({ message: 'Missing required fields.' });
      return;
    }

    let client;

    try {
      client = await MongoClient.connect(process.env.MONGODB_URI);
    } catch (error) {
      res.status(500).json({ message: 'Could not connect to database.' });
      return;
    }

    const db = client.db();

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email: email });

    if (existingUser) {
      res.status(409).json({ message: 'User already exists.' });
      client.close();
      return;
    }

    // You should hash the password before saving it in production
    const result = await db.collection("users").insertOne({
      email,
      password,
      name,
      phone,
      address,
      createdAt: new Date()
    });

    client.close();
    res.status(201).json({ message: "User created successfully", userId: result.insertedId });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
