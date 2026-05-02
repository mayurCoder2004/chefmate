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

router.post("/", async (req, res) => {
  const parsed = RecipeBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
  }

  const { prompt, ingredients, prefs = { diet: "none" } } = parsed.data;

  const system = [
    "You are a professional chef and nutrition coach.",
    "Use ONLY the provided ingredients as core items when ingredients are provided.",
    "Optional pantry items like oil, salt, pepper, basic spices are okay.",
    "Optimize for health and taste.",
    "Output STRICT JSON with keys: title, usedIngredients, optionalIngredients, healthBenefits, cookingSteps, estimatedTime, servings, notes."
  ].join(" ");

  const userPrompt = prompt || `
Ingredients: ${ingredients.join(", ")}
Diet: ${prefs.diet}
${prefs.maxTime ? `MaxTime: ${prefs.maxTime} minutes` : ""}
Return a single best recipe.
`;

  try {
    const { text, model } = await callOpenRouterWithFallback({
      messages: [
        { role: "system", content: system },
        { role: "user", content: [{ type: "text", text: userPrompt }] }
      ],
      temperature: 0.6,
      stream: false,
      extraPayload: {
        response_format: { type: "json_object" }
      }
    });

    const recipe = extractJSON(text);
    if (!recipe) return res.status(502).json({ error: "AI returned invalid JSON", rawText: text });

    return res.json({
      modelUsed: model,
      recipe
    });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({
      error: err.message || "LLM request failed",
      details: err.details || undefined
    });
  }
});

export default router;
