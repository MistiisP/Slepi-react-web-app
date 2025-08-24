import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

import chickenRoutes from "./routes/ChickenRoutes.js";
import eggRoutes from "./routes/EggRoutes.js";
import soldEggRoutes from "./routes/SoldEggRoutes.js";
import feedRoutes from "./routes/FeedRoutes.js";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// API endpoints (zatím jen základ)
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/chickens", chickenRoutes);
app.use("/api/eggs", eggRoutes);
app.use("/api/sold-eggs", soldEggRoutes);
app.use("/api/feeds", feedRoutes);

export default app;
