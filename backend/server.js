import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import mealPlanRoutes from "./routes/mealPlanRoutes.js";
import aiRecipeRoutes from "./routes/aiRecipeRoutes.js";
import { z } from "zod";
import { callOpenRouterWithFallback } from "./services/openRouterService.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// ------------------------
// Routes
// ------------------------
app.get("/", (req, res) => res.send("Backend is running"));

// Auth Routes
app.use("/api/auth", authRoutes);

// Saved recipes routes
app.use("/api/recipes", recipeRoutes);

// Meal Plan Routes
app.use("/api/meal-plan", mealPlanRoutes);
app.use("/api/recipe", aiRecipeRoutes);

// ------------------------
// Smart Recipe Route (OpenRouter - Mistral)
// ------------------------
const IngredientsBody = z.object({
  ingredients: z.array(z.string().min(1)).min(1).max(20),
  prefs: z.object({
    diet: z.enum(['none','veg','vegan','keto','paleo']).default('none'),
    maxTime: z.number().int().positive().max(240).optional()
  }).default({ diet: 'none' })
});

// Extract JSON safely from AI text
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

function toArray(value) {
  if (Array.isArray(value)) return value.map((x) => String(x).trim()).filter(Boolean);
  if (typeof value === "string") {
    return value
      .split(/\n|,|;|\d+\.\s+/)
      .map((x) => x.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeRecipe(raw) {
  const r = raw?.recipe && typeof raw.recipe === "object" ? raw.recipe : raw || {};
  const steps = toArray(r.cookingSteps || r.steps || r.instructions);
  const usedIngredients = toArray(r.usedIngredients || r.ingredients);
  const optionalIngredients = toArray(r.optionalIngredients || r.pantryItems);
  const healthBenefits = toArray(r.healthBenefits || r.benefits);
  const estimatedTime =
    typeof r.estimatedTime === "number"
      ? r.estimatedTime
      : Number(String(r.estimatedTime || r.time || "").match(/\d+/)?.[0] || 0);
  const servings =
    typeof r.servings === "number"
      ? r.servings
      : Number(String(r.servings || "").match(/\d+/)?.[0] || 0);

  return {
    title: String(r.title || r.name || "Smart Recipe"),
    usedIngredients,
    optionalIngredients,
    healthBenefits,
    cookingSteps: steps,
    estimatedTime,
    servings: servings || undefined,
    notes: typeof r.notes === "string" ? r.notes : ""
  };
}

function extractStructuredJSONFromChoice(choice) {
  if (!choice) return null;

  const visited = new Set();
  const walk = (node) => {
    if (node == null) return null;
    if (typeof node === "string") return extractJSON(node);
    if (typeof node !== "object") return null;
    if (visited.has(node)) return null;
    visited.add(node);

    if (Array.isArray(node)) {
      for (const item of node) {
        const found = walk(item);
        if (found) return found;
      }
      return null;
    }

    const keys = Object.keys(node);

    // If object already looks like a recipe payload, accept directly.
    if (keys.some((k) => ["title", "name", "ingredients", "usedIngredients", "cookingSteps", "steps", "instructions", "estimatedTime", "time"].includes(k))) {
      return node;
    }

    for (const key of keys) {
      const value = node[key];
      if (typeof value === "string") {
        const parsed = extractJSON(value);
        if (parsed) return parsed;
      } else {
        const found = walk(value);
        if (found) return found;
      }
    }

    return null;
  };

  const content = choice?.message?.content;
  const fromContent = walk(content);
  if (fromContent) return fromContent;

  const toolCalls = choice?.message?.tool_calls;
  const fromTools = walk(toolCalls);
  if (fromTools) return fromTools;

  const fromChoice = walk(choice);
  if (fromChoice) return fromChoice;

  return null;
}

app.post('/api/smart-recipe', async (req, res) => {
  const parsed = IngredientsBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });

  const { ingredients, prefs } = parsed.data;

  const system = [
    "You are a professional chef and nutrition coach.",
    "Use ONLY the provided ingredients as core items. Optional pantry items like oil, salt, pepper, basic spices are okay.",
    "Optimize for health (balanced macros, low ultra-processed, sensible sodium) and taste.",
    "Output STRICT JSON with keys: title, usedIngredients, optionalIngredients, healthBenefits, cookingSteps, estimatedTime, servings, notes."
  ].join(' ');

  const user = `
Ingredients: ${ingredients.join(', ')}
Diet: ${prefs.diet}
${prefs.maxTime ? `MaxTime: ${prefs.maxTime} minutes` : ''} 
Return a single best recipe. cookingSteps is an array of short, numbered steps.
estimatedTime is a number (minutes). servings is an integer (e.g. 2).
`;

  try {
    const { text, model, response } = await callOpenRouterWithFallback({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ],
      temperature: 0.6,
      stream: false,
      extraPayload: {
        response_format: { type: "json_object" }
      }
    });

    const firstChoice = response?.data?.choices?.[0] || null;
    const extracted = extractJSON(text) || extractStructuredJSONFromChoice(firstChoice);
    const recipe = normalizeRecipe(extracted);

    if (!extracted) {
      console.error("[smart-recipe] JSON parse failed", {
        model,
        finishReason: firstChoice?.finish_reason || null,
        hasMessage: Boolean(firstChoice?.message),
        contentType: Array.isArray(firstChoice?.message?.content)
          ? "array"
          : typeof firstChoice?.message?.content,
        messageKeys: firstChoice?.message && typeof firstChoice.message === "object" ? Object.keys(firstChoice.message) : [],
        contentKeys: firstChoice?.message?.content && typeof firstChoice.message.content === "object" && !Array.isArray(firstChoice.message.content)
          ? Object.keys(firstChoice.message.content)
          : [],
        textPreview: typeof text === "string" ? text.slice(0, 300) : "",
        choicePreview: firstChoice ? JSON.stringify(firstChoice).slice(0, 1200) : ""
      });
      return res.status(502).json({ error: 'AI returned invalid JSON', rawText: text });
    }

    const ok =
      typeof recipe.title === 'string' &&
      recipe.title.length > 0 &&
      Array.isArray(recipe.cookingSteps) &&
      recipe.cookingSteps.length > 0 &&
      Number.isFinite(recipe.estimatedTime) &&
      recipe.estimatedTime > 0;

    if (!ok) return res.status(502).json({ error: 'AI JSON missing required fields', raw: recipe });

    res.json({
      modelUsed: model,
      ...recipe,
      usedIngredients: [...new Set((recipe.usedIngredients ?? []).map(s => String(s).toLowerCase()))],
      optionalIngredients: [...new Set((recipe.optionalIngredients ?? []).map(s => String(s).toLowerCase()))]
    });

  } catch (err) {
    console.error(err.details || err.message);
    res.status(err.statusCode || 500).json({ error: err.message || "LLM request failed", details: err.details || undefined });
  }
});

// ------------------------
// Ping endpoint
// ------------------------
app.get('/ping', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
