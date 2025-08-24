import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// get all chickens '/api/chickens'
router.get("/", async (req, res) => {
  try {
    const chickens = await prisma.chicken.findMany();

    if (chickens) {
      return res.status(200).json(chickens);
    } else {
      return res.status(404).json({ error: "We don't have any chickens" });
    }
  } catch (error) {
    console.error("GET /api/chickens error:", error);

    return res.status(500).json({ error: "Failed to fetch chickens" });
  }
});

// get specific chicken '/api/chickens/:id'
router.get("/:id", async (req, res) => {
  try {
    const chicken = await prisma.chicken.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!chicken) {
      return res.status(404).json({ error: "Chicken not found" });
    }

    return res.status(200).json(chicken);
  } catch (error) {
    console.error(`GET /api/chickens/${req.params.id} error:`, error);

    return res.status(505).json({ error: "Failed to fetch chicken" });
  }
});

// create new chicken '/api/chickens'
router.post("/", async (req, res) => {
  const { name, ageInWeeks, description, photoUrl, breed, needFood } = req.body;

  try {
    const newChicken = await prisma.chicken.create({
      data: { name, ageInWeeks, description, photoUrl, breed, needFood },
    });

    if (newChicken) {
      return res.status(201).json(newChicken);
    } else {
      return res
        .status(404)
        .json({ error: "We can't create chicken with this params" });
    }
  } catch (error) {
    console.error(`POST /api/chickens error:`, error);

    return res.status(400).json({ error: "Failed to create chicken" });
  }
});

// update specific chicken '/api/chickens/:id'
router.put("/:id", async (req, res) => {
  try {
    const updatedChicken = await prisma.chicken.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });

    if (updatedChicken) {
      return res.status(200).json(updatedChicken);
    } else {
      return res
        .status(404)
        .json({ error: "We don't have chicken with that ID" });
    }
  } catch (error) {
    console.error(`UPDATE /api/chickens/${req.params.id} error:`, error);

    return res.status(400).json({ error: "Update of chicken info failed" });
  }
});

// update specific chicken '/api/chickens/:id'
router.delete("/:id", async (req, res) => {
  try {
    const deletedChicken = await prisma.chicken.delete({
      where: { id: parseInt(req.params.id) },
    });

    if (deletedChicken) {
      return res.status(200).json(deletedChicken);
    } else {
      return res
        .status(404)
        .json({ error: "We don't have chicken with that ID" });
    }
  } catch (error) {
    console.error(`DELETE /api/chickens/${req.params.id} error:`, error);

    return res.status(400).json({ error: "Failed to delete chicken" });
  }
});

export default router;
