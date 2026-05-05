import express from "express";
import { z } from "zod";
import { callOpenRouterWithFallback } from "../services/openRouterService.js";

const router = express.Router();

const RecipeBody = z.object({
  prompt: z.string().min(1).optional(),
  ingredients: z.array(z.string().min(1)).min(1).max(20).optional(),
  prefs: z
    .object({
      diet: z.enum(["none", "veg", "vegan", "keto", "paleo"]).default("none"),
      maxTime: z.number().int().positive().max(240).optional()
    })
    .optional()
}).superRefine((data, ctx) => {
  if (!data.prompt && !data.ingredients) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Either prompt or ingredients is required"
    });
  }
});

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

const REQUIRED_RECIPE_FIELDS = ['title', 'cookingSteps', 'usedIngredients'];

function isValidRecipe(obj) {
  if (!obj || typeof obj !== 'object') return false;
  for (const field of REQUIRED_RECIPE_FIELDS) {
    if (!(field in obj)) return false;
  }
  // title must be a non-empty string (not just ': ' or whitespace)
  if (typeof obj.title !== 'string' || obj.title.trim().length < 3) return false;
  // cookingSteps must be a non-empty array
  if (!Array.isArray(obj.cookingSteps) || obj.cookingSteps.length === 0) return false;
  // usedIngredients must be a non-empty array
  if (!Array.isArray(obj.usedIngredients) || obj.usedIngredients.length === 0) return false;
  return true;
}

router.post("/", async (req, res) => {
  const parsed = RecipeBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
  }

  const { prompt, ingredients, prefs = { diet: "none" } } = parsed.data;

  const systemPrompt = `You are a professional chef. Your ONLY job is to output a single valid JSON object. No prose, no markdown, no explanation — just the raw JSON.`;

  const userPrompt = `Create a recipe using these ingredients: ${ingredients ? ingredients.join(", ") : prompt || "any"}
Diet: ${prefs.diet}${prefs.maxTime ? `\nMax cooking time: ${prefs.maxTime} minutes` : ""}

Output a JSON object with EXACTLY these keys:
{
  "title": "recipe name",
  "usedIngredients": ["ingredient 1", "ingredient 2"],
  "optionalIngredients": ["item 1"],
  "healthBenefits": "one short sentence",
  "cookingSteps": ["Step 1: ...", "Step 2: ...", "Step 3: ...", "Step 4: ...", "Step 5: ..."],
  "estimatedTime": 30,
  "servings": 2,
  "notes": "one short tip"
}

Rules:
- cookingSteps: exactly 5 steps, each under 20 words
- All arrays must have at least one item
- estimatedTime and servings must be numbers
- Output raw JSON only, starting with {`;

  try {
    const { text, model } = await callOpenRouterWithFallback({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.5,
      stream: false,
      extraPayload: {
        response_format: { type: "json_object" }
      }
    });

    const recipe = extractJSON(text);

    if (!recipe) {
      console.error("[smart-recipe] JSON parse failed", { model, textPreview: text?.slice(0, 200) });
      return res.status(502).json({ error: "AI returned invalid JSON" });
    }

    if (!isValidRecipe(recipe)) {
      console.error("[smart-recipe] JSON missing required fields", {
        model,
        extractedKeys: Object.keys(recipe),
      });
      return res.status(502).json({ error: "AI JSON missing required fields" });
    }

    return res.json({ modelUsed: model, recipe });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({
      error: err.message || "LLM request failed",
      details: err.details || undefined
    });
  }
});

export default router;

