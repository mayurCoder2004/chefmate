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
// Utility: Salvage complete meals from a partially-parsed day response
// ------------------------
function repairTruncatedJSON(str) {
  if (!str || typeof str !== "string") return null;

  // 1. Happy path
  try {
    const parsed = JSON.parse(str);
    if (parsed && typeof parsed === "object") {
      if (Array.isArray(parsed)) return { day: 1, meals: parsed };
      return parsed;
    }
  } catch {}

  // 2. Try to extract the outermost JSON object
  const firstBrace = str.indexOf("{");
  const lastBrace = str.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      const candidate = str.slice(firstBrace, lastBrace + 1);
      return JSON.parse(candidate);
    } catch {}
  }

  // 3. Truncated — scrape complete meal objects from the meals array
  const mealsKeyIdx = str.indexOf('"meals"');
  if (mealsKeyIdx === -1) return null;
  const arrStart = str.indexOf('[', mealsKeyIdx);
  if (arrStart === -1) return null;

  const meals = [];
  let i = arrStart + 1;
  while (i < str.length) {
    while (i < str.length && /[\s,]/.test(str[i])) i++;
    if (i >= str.length || str[i] !== '{') break;

    let depth = 0, start = i, inStr = false, esc = false;
    while (i < str.length) {
      const ch = str[i];
      if (esc) { esc = false; i++; continue; }
      if (ch === '\\' && inStr) { esc = true; i++; continue; }
      if (ch === '"') { inStr = !inStr; i++; continue; }
      if (inStr) { i++; continue; }
      if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth === 0) {
          try {
            const obj = JSON.parse(str.slice(start, i + 1));
            if (obj?.name && Array.isArray(obj?.ingredients)) meals.push(obj);
          } catch {}
          i++; break;
        }
      }
      i++;
    }
  }

  // Extract day number from string
  const dayMatch = str.match(/"day"\s*:\s*(\d+)/);
  const day = dayMatch ? Number(dayMatch[1]) : 1;

  if (meals.length > 0) {
    console.warn(`[meal-plan] Salvaged ${meals.length} meal(s) from truncated response.`);
    return { day, meals };
  }

  return null;
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// ------------------------
// 1️⃣ Generate AI Meal Plan — one day at a time, sequentially
// Made public - authentication optional
// ------------------------
router.post("/", async (req, res) => {
  const parsed = MealPlanBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });

  const { days, diet, calories } = parsed.data;

  // Ultra-compact prompt: 2 meals per day, instructions max 8 words
  const buildDayPrompt = (dayNum) =>
    `Nutritionist. Day ${dayNum} only. Diet:${diet}.${calories ? ` ~${calories}kcal.` : ''} 2 meals (breakfast,dinner). Max 3 ingredients. Instructions: max 8 words. JSON only:\n{"day":${dayNum},"meals":[{"name":"","ingredients":[],"instructions":"","calories":0}]}`;

  const mealPlan = [];

  for (let d = 1; d <= days; d++) {
    try {
      // 800ms gap between requests to avoid rate-limiting
      if (d > 1) await sleep(800);

      const { text } = await callOpenRouterWithFallback({
        messages: [{ role: "system", content: buildDayPrompt(d) }],
        temperature: 0.7,
        stream: false,
        extraPayload: { response_format: { type: "json_object" } }
      });

      const extracted = repairTruncatedJSON(text);

      if (extracted && Array.isArray(extracted.meals) && extracted.meals.length > 0) {
        mealPlan.push({ ...extracted, day: d });
      } else {
        console.warn(`[meal-plan] Day ${d} unusable. Preview:`, text?.slice(0, 150));
        // Push a fallback placeholder so the day count stays intact
        mealPlan.push({
          day: d,
          meals: [
            { name: "Oatmeal with Fruits", ingredients: ["oats", "banana", "honey"], instructions: "Cook oats, top with fruit.", calories: 320 },
            { name: "Grilled Chicken & Veggies", ingredients: ["chicken", "broccoli", "olive oil"], instructions: "Grill chicken, steam veggies.", calories: 450 }
          ]
        });
      }
    } catch (err) {
      console.error(`[meal-plan] Day ${d} failed:`, err.message);
      // Push fallback so frontend always gets all days
      mealPlan.push({
        day: d,
        meals: [
          { name: "Yogurt Parfait", ingredients: ["yogurt", "berries", "granola"], instructions: "Layer and serve chilled.", calories: 300 },
          { name: "Veggie Stir Fry", ingredients: ["mixed veggies", "soy sauce", "rice"], instructions: "Stir-fry veggies, serve over rice.", calories: 420 }
        ]
      });
    }
  }

  res.json({ mealPlan, modelUsed: 'openrouter/free' });
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
