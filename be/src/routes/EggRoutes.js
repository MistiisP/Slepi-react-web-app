import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// get all eggs '/api/eggs'
router.get("/", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let whereClause = {}; 

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate); 
      end.setHours(23, 59, 59, 999); 

      // Ověření platnosti dat
      if (!isNaN(start) && !isNaN(end)) {
        whereClause.createdAt = {
          gte: start, // gte: Greater than or equal to (>=)
          lte: end,   // lte: Less than or equal to (<=)
        };
        console.log(`Filtruji vejce od ${start.toISOString()} do ${end.toISOString()}`);
      } else {
        console.warn("Neplatný formát data pro filtrování:", { startDate, endDate });
      }
    } else {
        console.log("Nefiltruji vejce podle data (parametry nebyly poskytnuty).");
    }

    const eggs = await prisma.egg.findMany({
      where: whereClause,
      orderBy: { 
        createdAt: 'asc', 
      }
    });
    
    res.json(eggs);

  } catch (error) {
    console.error("GET /api/eggs error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// get specific egg '/api/eggs/:id'
router.get("/:id", async (req, res) => {
  try {
    const egg = await prisma.egg.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!egg) {
      return res.status(404).json({ error: "Egg not found" });
    }

    return res.status(200).json(egg);
  } catch (error) {
    console.error(`GET /api/eggs/${req.params.id} error:`, error);

    return res.status(505).json({ error: "Failed to fetch egg" });
  }
});

// create egg '/api/eggs'
router.post("/", async (req, res) => {
  try {
    // Získejte count i createdAt z těla požadavku
    const { count, createdAt } = req.body;

    // Validace (základní)
    if (typeof count !== 'number' || count <= 0) {
      return res.status(400).json({ error: "Invalid count value" });
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

    const newEgg = await prisma.egg.create({
      data: { 
        count: count,
        createdAt: dateToUse, 
      },
    });

    return res.status(201).json(newEgg);

  } catch (error) {
    console.error("POST /api/eggs error:", error);
    if (error.code) {
       return res.status(400).json({ error: "Failed to create egg", details: error.message });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
