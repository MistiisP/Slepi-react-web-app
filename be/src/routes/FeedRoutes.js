import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// get all feeds '/api/feeds'
router.get("/", async (req, res) => {
  try {
    const feeds = await prisma.feed.findMany();
    res.json(feeds);
    if (feeds) {
      return res.status(200).json(feeds);
    } else {
      return res.status(404).json({ error: "We don't have any feeds" });
    }
  } catch (error) {
    console.error("GET /api/feeds error:", error);

    return res.status(500).json({ error: "Failed to fetch feeds" });
  }
});

// get specific feed '/api/feeds/:id'
router.get("/:id", async (req, res) => {
  try {
    const feed = await prisma.feed.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!feed) {
      return res.status(404).json({ error: "Feed not found" });
    }
    return res.status(200).json(feed);
  } catch (error) {
    console.error(`GET /api/feeds/${req.params.id} error:`, error);

    return res.status(505).json({ error: "Failed to fetch feed" });
  }
});

// create new feed '/api/feeds'
router.post("/", async (req, res) => {
  const { name, weight, pricePerKg } = req.body;
  try {
    const newFeed = await prisma.feed.create({
      data: { name, weight, pricePerKg },
    });
    if (newFeed) {
      return res.status(201).json(newFeed);
    } else {
      return res
        .status(404)
        .json({ error: `We can't create feed with this params` });
    }
  } catch (error) {
    console.error("POST /api/feeds error:", error);

    return res.status(500).json({ error: "Failed to create feed" });
  }
});

// update specific feed '/api/feeds/:id'
router.put("/:id", async (req, res) => {
  try {
    const updatedFeed = await prisma.feed.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    if (updatedFeed) {
      return res.status(200).json(updatedFeed);
    } else {
      return res.status(404).json({ error: "We don't have feed with this ID" });
    }
  } catch (error) {
    console.error(`UPDATE /api/feeds/${req.params.id} error:`, error);

    return res.status(500).json({ error: "Failed to update feed" });
  }
});

// delete specific feed '/api/feeds/:id'
router.delete("/:id", async (req, res) => {
  try {
    const updatedFeeds = await prisma.feed.delete({
      where: { id: parseInt(req.params.id) },
    });
    if (updatedFeeds) {
      return res.status(200).json(updatedFeeds);
    } else {
      return res.status(404).json({ error: "We don't have feed wit this ID" });
    }
  } catch (error) {
    console.error(`DELETE /api/feeds/${req.params.id} error:`, error);

    return res.status(500).json({ error: "Failed to delete feed" });
  }
});

export default router;
