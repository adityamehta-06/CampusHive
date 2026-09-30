import express from "express";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { db } from "../db.mjs";
import authMiddleware from "../auth/authmiddleware.mjs";

const authRouter = express.Router();

// create JWT
function makeToken(user) {
  const payload = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// register
authRouter.post("/register", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email?.toLowerCase();
  const password = req.body.password;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters." });
  }

  const existingUser = await db.collection("users").findOne({ email: email });
  if (existingUser) {
    return res.status(409).json({ message: "This email is already registered." });
  }

  const newUser = {
    name: name,
    email: email,
    password: password,
    createdAt: new Date(),
  };

  const result = await db.collection("users").insertOne(newUser);
  newUser._id = result.insertedId;

  res.status(201).json({
    token: makeToken(newUser),
    user: { id: newUser._id, name: newUser.name, email: newUser.email },
  });
});

// login
authRouter.post("/login", async (req, res) => {
  const email = req.body.email?.toLowerCase();
  const password = req.body.password;

  const user = await db.collection("users").findOne({ email: email, password: password });

  if (!user) {
    return res.status(401).json({ message: "Incorrect email or password." });
  }

  res.json({
    token: makeToken(user),
    user: { id: user._id, name: user.name, email: user.email },
  });
});

// logged-in user
authRouter.get("/me", authMiddleware, async (req, res) => {
  const user = await db.collection("users").findOne({ _id: new ObjectId(req.user.id) });

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }
  res.json({ id: user._id, name: user.name, email: user.email });
});

export default authRouter;
