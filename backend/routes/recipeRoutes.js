import express from "express";
import User from "../models/User.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

// Save recipe
router.post("/save", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Ensure healthBenefits is always an array
    const recipeData = {
      ...req.body,
      healthBenefits: Array.isArray(req.body.healthBenefits)
        ? req.body.healthBenefits
        : req.body.healthBenefits ? [req.body.healthBenefits] : []
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
