import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import User from "../models/User.js";
import { z } from "zod";
import { callOpenRouterWithFallback } from "../services/openRouterService.js";

const router = express.Router();

// ------------------------
// Validation Schemas
// ------------------------
const MealPlanBody = z.object({
  days: z.number().int().min(1).max(14),
  diet: z.enum(['none','veg','vegan','keto','paleo']).default('none'),
  calories: z.number().positive().optional()
});

const SaveMealPlanBody = z.object({
  mealPlan: z.array(z.any()).min(1),
  diet: z.enum(['none','veg','vegan','keto','paleo']).default('none')
});

// ------------------------
// Utility: Extract JSON from AI text
// ------------------------
function extractJSON(str) {
  if (!str || typeof str !== "string") return null;

  try { return JSON.parse(str); } catch {}

  const fenced = str.match(/```json\s*([\s\S]*?)\s*```/i) || str.match(/```\s*([\s\S]*?)\s*```/i);
  if (fenced?.[1]) {
    try { return JSON.parse(fenced[1]); } catch {}
  }

  const firstObj = str.indexOf("{");
  const lastObj = str.lastIndexOf("}");
  if (firstObj !== -1 && lastObj !== -1 && lastObj > firstObj) {
    const candidate = str.slice(firstObj, lastObj + 1);
    try { return JSON.parse(candidate); } catch {}
  }

  const firstArr = str.indexOf("[");
  const lastArr = str.lastIndexOf("]");
  if (firstArr !== -1 && lastArr !== -1 && lastArr > firstArr) {
    const candidate = str.slice(firstArr, lastArr + 1);
    try { return JSON.parse(candidate); } catch {}
  }

  return null;
}

// ------------------------
// 1️⃣ Generate AI Meal Plan
// ------------------------
router.post("/", verifyToken, async (req, res) => {
  const parsed = MealPlanBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });

  const { days, diet, calories } = parsed.data;

  const systemPrompt = `
You are a professional nutritionist and chef.
Generate a ${days}-day meal plan.
Diet: ${diet}.
${calories ? `Calories per day: ${calories}` : ''} 
Return STRICT JSON in the format:
[{
  day: 1,
  meals: [{
    name: string,
    ingredients: [string],
    instructions: string,
    calories: number (optional)
  }]
}]
  `;

  try {
    const { text, model } = await callOpenRouterWithFallback({
      messages: [{ role: "system", content: systemPrompt }],
      temperature: 0.6,
      stream: false,
      extraPayload: {
        response_format: { type: "json_object" }
      }
    });
    const mealPlan = extractJSON(text);

    if (!mealPlan) return res.status(502).json({ error: 'AI returned invalid JSON', rawText: text });

    res.json({ mealPlan, modelUsed: model });
  } catch (err) {
    console.error(err.details || err.message);
    res.status(err.statusCode || 500).json({ error: err.message || 'LLM request failed', details: err.details || undefined });
  }
});

// ------------------------
// 2️⃣ Save Meal Plan
// ------------------------
router.post("/save", verifyToken, async (req, res) => {
  const parsed = SaveMealPlanBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });

  const { mealPlan, diet } = parsed.data;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.savedMealPlans = user.savedMealPlans || [];
    user.savedMealPlans.push({ plan: mealPlan, diet, createdAt: new Date() });

    await user.save();
    res.json({ message: "Meal plan saved successfully", savedMealPlans: user.savedMealPlans });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save meal plan" });
  }
});

// ------------------------
// 3️⃣ Fetch Saved Meal Plans
// ------------------------
router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ savedMealPlans: user.savedMealPlans || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch meal plans" });
  }
});

export default router;
