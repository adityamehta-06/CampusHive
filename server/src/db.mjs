import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

// connect to MongoDB
const client = new MongoClient(process.env.MONGODB_URI);

// use campushive
const db = client.db("campushive");

export { client, db };
