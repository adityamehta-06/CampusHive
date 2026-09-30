import dotenv from "dotenv";
import express from "express";
import path from "path";
import cors from "cors";
import { client, db } from "./db.mjs";
import authRouter from "./routes/authRouter.mjs";
import resourceRouter from "./routes/resourceRouter.mjs";
import borrowRequestRouter from "./routes/borrowRequestRouter.mjs";

dotenv.config();
const app = express();
const __dirname = import.meta.dirname;
const PORT = process.env.PORT || 5000;

// middlewares
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// serve uploaded photos
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// routes
app.use("/api/auth", authRouter);
app.use("/api/resources", resourceRouter);
app.use("/api/borrow-requests", borrowRequestRouter);

// 404 route
app.all("/*splat", (req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// error handler (multer errors)
app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "Image must be smaller than 2 MB." });
  }
  res.status(400).json({ message: err.message });
});

// connect DB, then start server
client.connect()
  .then(() => {
    console.log("Connected to MongoDB");

    // unique email
    db.collection("users").createIndex({ email: 1 }, { unique: true });

    app.listen(PORT, () => {
      console.log(`CampusHive API running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err.message);
  });
