import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";
// import { connectToDatabase } from "../../../database/mongoose";

let authInstance = null;

export const getAuth = async () => {
  if (authInstance) return authInstance;
  // const mongoose = await connectToDatabase();
  const client = new MongoClient(process.env.MONGODB_URI);
  const db = client.db();

  // const db = mongoose.connection.db;
  if (!db) throw new Error("MongoDB connection betterAuth failed");
  authInstance = betterAuth({
    database: mongodbAdapter(db),
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    emailAndPassword: {
      enabled: true,
      disableSignUp: false,
      requireEmailVerification: false,
      minPasswordLength: 8,
      maxPasswordLength: 100,
      autoSignIn: true,
    },
    plugins: [nextCookies()],
  });
  return authInstance;
};

export const auth = await getAuth();
