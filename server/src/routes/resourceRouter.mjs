import express from "express";
import { ObjectId } from "mongodb";
import { db } from "../db.mjs";
import authMiddleware from "../auth/authmiddleware.mjs";
import upload from "../upload.mjs";

const resourceRouter = express.Router();

// DB document -> frontend object
function toResource(doc) {
  return {
    id: doc._id,
    name: doc.name,
    category: doc.category,
    condition: doc.condition,
    description: doc.description,
    imageUrl: doc.imageUrl,
    available: doc.status,
    owner: doc.ownerName,
    ownerId: doc.ownerId,
  };
}

// all resources
resourceRouter.get("/", async (req, res) => {
  const resources = await db.collection("resources").find().sort({ createdAt: -1 }).toArray();
  res.json(resources.map(toResource));
});

// one resource
resourceRouter.get("/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: "Resource not found." });
  }

  const resource = await db.collection("resources").findOne({ _id: new ObjectId(req.params.id) });
  if (!resource) {
    return res.status(404).json({ message: "Resource not found." });
  }
  res.json(toResource(resource));
});

// add resource (with photo)
resourceRouter.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  const { name, category, condition, description } = req.body;

  let imageUrl = "";
  if (req.file) {
    imageUrl = "/uploads/" + req.file.filename;
  }

  if (!name || !category || !condition) {
    return res.status(400).json({ message: "Name, category, and condition are required." });
  }

  const newResource = {
    name: name,
    category: category,
    condition: condition,
    description: description || "",
    imageUrl: imageUrl,
    status: "Available",
    ownerId: new ObjectId(req.user.id),
    ownerName: req.user.name,
    createdAt: new Date(),
  };

  const result = await db.collection("resources").insertOne(newResource);
  newResource._id = result.insertedId;

  res.status(201).json(toResource(newResource));
});

// edit (owner only)
resourceRouter.patch("/:id", authMiddleware, async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: "Resource not found." });
  }

  const resource = await db.collection("resources").findOne({ _id: new ObjectId(req.params.id) });
  if (!resource) {
    return res.status(404).json({ message: "Resource not found." });
  }
  if (resource.ownerId.toString() !== req.user.id) {
    return res.status(403).json({ message: "You can edit only your own resources." });
  }

  const changes = {
    name: req.body.name || resource.name,
    category: req.body.category || resource.category,
    condition: req.body.condition || resource.condition,
    description: req.body.description ?? resource.description,
    imageUrl: req.body.imageUrl ?? resource.imageUrl,
  };

  await db.collection("resources").updateOne({ _id: resource._id }, { $set: changes });

  const updated = await db.collection("resources").findOne({ _id: resource._id });
  res.json(toResource(updated));
});

// delete (owner only)
resourceRouter.delete("/:id", authMiddleware, async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: "Resource not found." });
  }

  const resource = await db.collection("resources").findOne({ _id: new ObjectId(req.params.id) });
  if (!resource) {
    return res.status(404).json({ message: "Resource not found." });
  }
  if (resource.ownerId.toString() !== req.user.id) {
    return res.status(403).json({ message: "You can delete only your own resources." });
  }
  if (resource.status === "Borrowed") {
    return res.status(400).json({ message: "You cannot delete a resource while someone has borrowed it." });
  }

  await db.collection("resources").deleteOne({ _id: resource._id });
  res.status(204).send();
});

export default resourceRouter;
