import express from "express";
import User from "../models/User.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

// Save recipe
router.post("/save", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

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

    // Ensure healthBenefits is always an array
    const recipeData = {
      ...req.body,
      title: String(req.body.title || "Untitled Recipe"),
      usedIngredients: toArray(req.body.usedIngredients),
      optionalIngredients: toArray(req.body.optionalIngredients),
      cookingSteps: toArray(req.body.cookingSteps),
      healthBenefits: toArray(req.body.healthBenefits),
      estimatedTime: toNumberOrUndefined(req.body.estimatedTime),
      servings: toNumberOrUndefined(req.body.servings)
    };

    user.savedRecipes.push(recipeData);
    await user.save();

    res.json({ message: "Recipe saved successfully", savedRecipes: user.savedRecipes });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// Get saved recipes
router.get("/saved", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// Delete a saved recipe
router.delete("/remove/:recipeId", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const { recipeId } = req.params;
    user.savedRecipes = user.savedRecipes.filter(r => r._id.toString() !== recipeId);
    await user.save();

    res.json({ message: "Recipe removed successfully", savedRecipes: user.savedRecipes });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

export default router;
