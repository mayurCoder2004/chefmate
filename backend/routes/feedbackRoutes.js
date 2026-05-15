import express from "express";
import RecipeFeedback from "../models/RecipeFeedback.js";

const router = express.Router();

// POST /api/feedback/recipe
router.post("/recipe", async (req, res) => {
  try {
    const { recipeName, ingredients, rating, timestamp } = req.body;

    // Basic validation
    if (!recipeName || !ingredients || !rating) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    if (!["helpful", "not_helpful"].includes(rating)) {
      return res.status(400).json({
        success: false,
        message: "Invalid rating value"
      });
    }

    // Create feedback document
    const feedback = new RecipeFeedback({
      recipeName,
      ingredients: Array.isArray(ingredients) ? ingredients : [],
      rating,
      timestamp: timestamp || new Date()
    });

    await feedback.save();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save feedback"
    });
  }
});

export default router;
