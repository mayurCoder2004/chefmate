import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import { z } from "zod";
import { getSmartRecipe } from "./gemini.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// Debug: confirm env is loaded
console.log("Gemini API Key loaded:", process.env.GEMINI_API_KEY ? "✅ yes" : "❌ no");

app.get("/", (req, res) => res.send("Backend is running"));

// Auth Routes
app.use("/api/auth", authRoutes);

// Gemini API routes
const IngredientsBody = z.object({
  ingredients: z.array(z.string().min(1)).min(1).max(20),
  prefs: z.object({
    diet: z.enum(["none", "veg", "vegan", "keto", "paleo"]).default("none"),
    maxTime: z.number().int().positive().max(240).optional(),
  }).default({ diet: "none" }),
});

app.post("/api/smart-recipe", async (req, res) => {
  const parsed = IngredientsBody.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: "Invalid input", details: parsed.error.flatten() });
  }

  try {
    const recipe = await getSmartRecipe(parsed.data);
    res.json(recipe);
  } catch (err) {
    console.error("Gemini API Error:", err.message);
    if (err.message.includes("API key not valid")) {
      return res.status(401).json({ error: "Invalid Gemini API Key" });
    }
    res.status(500).json({ error: err.message || "Gemini request failed" });
  }
});

app.get("/ping", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
