import express from "express";
import SharedRecipe from "../models/SharedRecipe.js";

const router = express.Router();

// POST - Create shareable recipe
router.post("/share-recipe", async (req, res) => {
  try {
    const toArray = (value) => {
      if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
      if (typeof value === "string") {
        return value
          .split(/\n|,|;|\d+\.\s+/)
          .map((v) => v.trim())
          .filter(Boolean);
      }
      return [];
    };

    const toNumberOrUndefined = (value) => {
      if (value === undefined || value === null || value === "") return undefined;
      if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
      const matched = String(value).match(/\d+/);
      if (!matched) return undefined;
      const n = Number(matched[0]);
      return Number.isFinite(n) ? n : undefined;
    };

    const recipeData = {
      title: String(req.body.title || "Untitled Recipe"),
      usedIngredients: toArray(req.body.usedIngredients),
      optionalIngredients: toArray(req.body.optionalIngredients),
      cookingSteps: toArray(req.body.cookingSteps),
      healthBenefits: toArray(req.body.healthBenefits),
      estimatedTime: toNumberOrUndefined(req.body.estimatedTime),
      servings: toNumberOrUndefined(req.body.servings),
      notes: req.body.notes || ""
    };

    const sharedRecipe = new SharedRecipe(recipeData);
    await sharedRecipe.save();

    res.json({ shareId: sharedRecipe._id.toString() });
  } catch (err) {
    console.error("Error creating shared recipe:", err);
    res.status(500).json({ error: "Failed to create shareable link" });
  }
});

// GET - Fetch shared recipe by ID
router.get("/share-recipe/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid share ID format" });
    }

    const recipe = await SharedRecipe.findById(id);
    
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json(recipe);
  } catch (err) {
    console.error("Error fetching shared recipe:", err);
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
});

export default router;
