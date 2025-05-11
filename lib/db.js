import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI, {
});

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    await client.connect();
    const db = client.db();
    cachedClient = client;
    cachedDb = db;
    console.log("Database Connected.");
    return { client, db };
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
}
