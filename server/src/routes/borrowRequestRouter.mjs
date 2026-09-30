import express from "express";
import { ObjectId } from "mongodb";
import { db } from "../db.mjs";
import authMiddleware from "../auth/authmiddleware.mjs";

const borrowRequestRouter = express.Router();

// send borrow request
borrowRequestRouter.post("/", authMiddleware, async (req, res) => {
  const resourceId = req.body.resourceId;
  const durationDays = Number(req.body.durationDays);

  if (!durationDays || durationDays < 1 || durationDays > 30) {
    return res.status(400).json({ message: "Borrow duration must be between 1 and 30 days." });
  }
  if (!ObjectId.isValid(resourceId)) {
    return res.status(404).json({ message: "Resource not found." });
  }

  const resource = await db.collection("resources").findOne({ _id: new ObjectId(resourceId) });

  if (!resource || resource.status !== "Available") {
    return res.status(400).json({ message: "This resource is not available." });
  }
  if (resource.ownerId.toString() === req.user.id) {
    return res.status(400).json({ message: "You cannot borrow your own resource." });
  }

  // no duplicate request
  const alreadyRequested = await db.collection("borrowRequests").findOne({
    resourceId: resource._id,
    requesterId: new ObjectId(req.user.id),
    status: "Pending",
  });
  if (alreadyRequested) {
    return res.status(409).json({ message: "You already have a pending request for this resource." });
  }

  const newRequest = {
    resourceId: resource._id,
    requesterId: new ObjectId(req.user.id),
    ownerId: resource.ownerId,
    resourceName: resource.name,
    requesterName: req.user.name,
    ownerName: resource.ownerName,
    durationDays: durationDays,
    status: "Pending",
    dueDate: null,
    createdAt: new Date(),
  };

  const result = await db.collection("borrowRequests").insertOne(newRequest);
  newRequest._id = result.insertedId;
  res.status(201).json(newRequest);
});

// requests for my items
borrowRequestRouter.get("/received", authMiddleware, async (req, res) => {
  const requests = await db.collection("borrowRequests")
    .find({ ownerId: new ObjectId(req.user.id) })
    .sort({ createdAt: -1 })
    .toArray();
  res.json(requests);
});

// my requests
borrowRequestRouter.get("/mine", authMiddleware, async (req, res) => {
  const requests = await db.collection("borrowRequests")
    .find({ requesterId: new ObjectId(req.user.id) })
    .sort({ createdAt: -1 })
    .toArray();
  res.json(requests);
});

// approve / reject / return
borrowRequestRouter.patch("/:id/status", authMiddleware, async (req, res) => {
  const newStatus = req.body.status;

  if (!ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: "Borrow request not found." });
  }

  const request = await db.collection("borrowRequests").findOne({ _id: new ObjectId(req.params.id) });
  if (!request) {
    return res.status(404).json({ message: "Borrow request not found." });
  }

  const resource = await db.collection("resources").findOne({ _id: request.resourceId });
  if (!resource) {
    return res.status(404).json({ message: "This resource has been removed." });
  }

  const isOwner = request.ownerId.toString() === req.user.id;
  const isBorrower = request.requesterId.toString() === req.user.id;

  if (newStatus === "Approved" && isOwner && request.status === "Pending") {
    if (resource.status !== "Available") {
      return res.status(400).json({ message: "This resource is already borrowed." });
    }
    const dueDate = new Date(Date.now() + request.durationDays * 24 * 60 * 60 * 1000);

    await db.collection("borrowRequests").updateOne({ _id: request._id }, { $set: { status: "Approved", dueDate: dueDate } });
    await db.collection("resources").updateOne({ _id: resource._id }, { $set: { status: "Borrowed" } });
  } else if (newStatus === "Rejected" && isOwner && request.status === "Pending") {
    await db.collection("borrowRequests").updateOne({ _id: request._id }, { $set: { status: "Rejected" } });
  } else if (newStatus === "Returned" && isBorrower && request.status === "Approved") {
    await db.collection("borrowRequests").updateOne({ _id: request._id }, { $set: { status: "Returned" } });
    await db.collection("resources").updateOne({ _id: resource._id }, { $set: { status: "Available" } });
  } else {
    return res.status(403).json({ message: "This action is not allowed." });
  }

  const updated = await db.collection("borrowRequests").findOne({ _id: request._id });
  res.json(updated);
});

export default borrowRequestRouter;
