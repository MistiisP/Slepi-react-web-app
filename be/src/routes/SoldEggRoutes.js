import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// get all sold eggs '/api/sold-eggs'
router.get("/", async (req, res) => {
  try {
    const soldEgg = await prisma.soldEgg.findMany();
    if (soldEgg) {
      return res.status(200).json(soldEgg);
    } else {
      return res.status(404).json({ error: "We don't have any sold eggs" });
    }
  } catch (error) {
    console.error("GET /api/sold-eggs error:", error);

    return res.status(500).json({ error: "Failed to fetch eggs" });
  }
});

// get specific sold egg '/api/sold-eggs/:id'
router.get("/:id", async (req, res) => {
  try {
    const soldEgg = await prisma.soldEgg.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!soldEgg) {
      return res.status(404).json({ error: "Egg not found" });
    }

    return res.status(200).json(soldEgg);
  } catch (error) {
    console.error(`GET /api/sold-egg/${req.params.id} error:`, error);

    return res.status(505).json({ error: "Failed to fetch egg" });
  }
});

// create new sold egg '/api/sold-eggs'
router.post("/", async (req, res) => {
  const { count, price, createdAt } = req.body; 

  try {
    if (typeof count !== 'number' || count <= 0) {
      return res.status(400).json({ error: "Invalid count value" });
    }
    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ error: "Invalid price value" });
    }

    let dateToUse;
    if (createdAt) {
      dateToUse = new Date(createdAt);
      if (isNaN(dateToUse.getTime())) {
        return res.status(400).json({ error: "Invalid createdAt date format" });
      }
    } else {
      dateToUse = new Date(); 
    }

    const newSoldEgg = await prisma.soldEgg.create({
      data: { 
        count: count,
        price: price,
        soldAt: dateToUse,
      },
    });
    return res.status(201).json(newSoldEgg);

  } catch (error) {
    console.error("POST /api/sold-eggs error:", error);
    if (error.code) { 
       return res.status(400).json({ error: "Failed to create sold egg record", details: error.message });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


export default router;
