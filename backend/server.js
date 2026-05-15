import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import mealPlanRoutes from "./routes/mealPlanRoutes.js";
import aiRecipeRoutes from "./routes/aiRecipeRoutes.js";
import shareRoutes from "./routes/shareRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import { z } from "zod";
import { callOpenRouterWithFallback } from "./services/openRouterService.js";
import {
  recipeLimiter,
  mealPlanLimiter,
  smartRecipeLimiter
} from "./middlewares/rateLimit.js";
import { authOptional } from "./middlewares/auth.js";


dotenv.config();

const app = express();
app.use(cors({
  origin: "https://chefmate-frontend.vercel.app", // Your exact Vercel URL
  credentials: true
}));
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

// Meal Plan Routes (with rate limiting for AI generation)
app.use("/api/meal-plan", mealPlanRoutes);

// AI Recipe Routes (with rate limiting)
app.use("/api/recipe", aiRecipeRoutes);

// Share Routes
app.use("/api", shareRoutes);

// Email Capture Routes
app.use("/api/email", emailRoutes);

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
    try { 
      const parsed = JSON.parse(candidate);
      // If it's an array, try to find a recipe object in it
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed[0]; // Return first item if array
      }
      return parsed;
    } catch {}
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
  // Handle array responses - take first item
  if (Array.isArray(raw)) {
    if (raw.length === 0) {
      console.warn("[normalizeRecipe] Received empty array");
      return null;
    }
    console.log("[normalizeRecipe] Received array, using first item");
    raw = raw[0];
  }

  // Handle null/undefined
  if (!raw || typeof raw !== "object") {
    console.warn("[normalizeRecipe] Invalid input:", typeof raw);
    return null;
  }

  const r = raw?.recipe && typeof raw.recipe === "object" ? raw.recipe : raw || {};
  
  const steps = toArray(r.cookingSteps || r.steps || r.instructions || r.directions || r.method);
  const usedIngredients = toArray(r.usedIngredients || r.ingredients || r.mainIngredients);
  const optionalIngredients = toArray(r.optionalIngredients || r.pantryItems || r.optional);
  const healthBenefits = toArray(r.healthBenefits || r.benefits || r.nutrition);
  
  const estimatedTime =
    typeof r.estimatedTime === "number"
      ? r.estimatedTime
      : Number(String(r.estimatedTime || r.time || r.cookTime || r.totalTime || "").match(/\d+/)?.[0] || 0);
  
  const servings =
    typeof r.servings === "number"
      ? r.servings
      : Number(String(r.servings || r.serves || r.yield || "").match(/\d+/)?.[0] || 0);

  // Validate minimum required fields
  const hasTitle = Boolean(r.title || r.name || r.recipeName);
  const hasSteps = steps.length > 0;
  const hasIngredients = usedIngredients.length > 0;

  if (!hasTitle || !hasSteps || !hasIngredients) {
    console.warn("[normalizeRecipe] Missing required fields:", {
      hasTitle,
      hasSteps,
      hasIngredients,
      rawKeys: Object.keys(r)
    });
    return null;
  }

  return {
    title: String(r.title || r.name || r.recipeName || "Smart Recipe"),
    usedIngredients,
    optionalIngredients,
    healthBenefits,
    cookingSteps: steps,
    estimatedTime: estimatedTime || 25,
    servings: servings || undefined,
    notes: typeof r.notes === "string" ? r.notes : ""
  };
}

function buildLocalFallbackRecipe(ingredients, prefs = {}) {
  const base = ingredients.map((x) => String(x).toLowerCase().trim()).filter(Boolean);
  const title = `${base.slice(0, 2).map((w) => w[0]?.toUpperCase() + w.slice(1)).join(" & ")} Quick Bowl`;
  const estimatedTime = prefs?.maxTime && Number.isFinite(prefs.maxTime) ? Math.min(prefs.maxTime, 30) : 25;

  return {
    title: title || "Quick Smart Bowl",
    usedIngredients: base,
    optionalIngredients: ["oil", "salt", "pepper", "turmeric", "cumin"],
    healthBenefits: [
      "Uses whole ingredients with minimal processing",
      "Balanced carbs with hydration-rich vegetables",
      "Lower sodium possible by light seasoning"
    ],
    cookingSteps: [
      `Rinse and prep: ${base.join(", ")}.`,
      "Heat a pan with a little oil, add spices, then cook tomatoes until soft.",
      "Add rice with water, simmer until cooked and flavors combine.",
      "Adjust salt and pepper lightly, rest for 2 minutes, and serve warm."
    ],
    estimatedTime,
    servings: 2,
    notes: "Generated via local fallback because AI provider is temporarily rate-limited."
  };
}

function scoreRecipeCandidate(obj) {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return 0;
  const has = (k) => Object.prototype.hasOwnProperty.call(obj, k);
  let score = 0;
  if (has("title") || has("name")) score += 4;
  if (has("cookingSteps") || has("steps") || has("instructions")) score += 4;
  if (has("usedIngredients") || has("ingredients")) score += 3;
  if (has("estimatedTime") || has("time")) score += 3;
  if (has("healthBenefits") || has("benefits")) score += 1;
  return score;
}

function extractStructuredJSONFromChoice(choice) {
  if (!choice) return null;

  const visited = new Set();
  let bestCandidate = null;
  let bestScore = 0;
  
  const walk = (node) => {
    if (node == null) return null;
    if (typeof node === "string") {
      const parsed = extractJSON(node);
      // If parsed is an array, take first item
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed[0];
      }
      return parsed;
    }
    if (typeof node !== "object") return null;
    if (visited.has(node)) return null;
    visited.add(node);

    if (Array.isArray(node)) {
      // If it's an array, check each item
      for (const item of node) {
        if (item && typeof item === "object" && !Array.isArray(item)) {
          const score = scoreRecipeCandidate(item);
          if (score > bestScore) {
            bestScore = score;
            bestCandidate = item;
          }
          if (score >= 8) {
            return item; // Found a good recipe object
          }
        }
        const found = walk(item);
        if (found) return found;
      }
      // Return best candidate from array if found
      if (bestCandidate && bestScore >= 5) {
        return bestCandidate;
      }
      return null;
    }

    const keys = Object.keys(node);

    const candidateScore = scoreRecipeCandidate(node);
    if (candidateScore > bestScore) {
      bestScore = candidateScore;
      bestCandidate = node;
    }
    if (candidateScore >= 8) {
      return node;
    }

    for (const key of keys) {
      const value = node[key];
      if (typeof value === "string") {
        const parsed = extractJSON(value);
        if (parsed) {
          // If parsed is an array, take first item
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed[0];
          }
          return parsed;
        }
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

  return bestScore > 0 ? bestCandidate : null;
}

app.post('/api/smart-recipe',authOptional, smartRecipeLimiter, async (req, res) => {
  const parsed = IngredientsBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });

  const { ingredients, prefs } = parsed.data;

  const systemPrompt = `
You are a professional chef and nutrition coach.
Use ONLY the provided ingredients as core items. Optional pantry items like oil, salt, pepper, basic spices are okay.
Optimize for health (balanced macros, low ultra-processed, sensible sodium) and taste.

Ingredients: ${ingredients.join(', ')}
Diet: ${prefs.diet}
${prefs.maxTime ? `MaxTime: ${prefs.maxTime} minutes` : ''} 

Output STRICT JSON with keys: title, usedIngredients, optionalIngredients, healthBenefits, cookingSteps, estimatedTime, servings, notes.
Return a single best recipe. cookingSteps is an array of short, numbered steps.
estimatedTime is a number (minutes). servings is an integer (e.g. 2).
`;

  try {
    const { text, model, response } = await callOpenRouterWithFallback({
      messages: [{ role: 'system', content: systemPrompt }],
      temperature: 0.6,
      stream: false,
      extraPayload: {
        response_format: { type: "json_object" }
      }
    });

    const firstChoice = response?.data?.choices?.[0] || null;
    let extracted = extractJSON(text) || extractStructuredJSONFromChoice(firstChoice);
    
    // Handle array responses - take first item
    if (Array.isArray(extracted) && extracted.length > 0) {
      console.log("[smart-recipe] Received array response, using first item");
      extracted = extracted[0];
    }
    
    const recipe = normalizeRecipe(extracted);
    
    // If normalization failed, use fallback
    if (!recipe) {
      console.error("[smart-recipe] Normalization failed, using fallback", {
        model,
        extractedType: Array.isArray(extracted) ? "array" : typeof extracted,
        extractedKeys: extracted && typeof extracted === "object" && !Array.isArray(extracted) ? Object.keys(extracted) : [],
        textPreview: typeof text === "string" ? text.slice(0, 300) : ""
      });
      
      const fallbackRecipe = buildLocalFallbackRecipe(ingredients, prefs);
      return res.status(200).json({
        modelUsed: "local-fallback",
        fallback: true,
        ...fallbackRecipe
      });
    }
    
    // Ensure estimatedTime is set
    if (!recipe.estimatedTime || recipe.estimatedTime <= 0) {
      recipe.estimatedTime = prefs?.maxTime || 25;
    }
    
    // Ensure cookingSteps exist
    if (!recipe.cookingSteps || recipe.cookingSteps.length === 0) {
      if (recipe.usedIngredients.length > 0) {
        recipe.cookingSteps = [
          `Wash and prep ${recipe.usedIngredients.slice(0, 3).join(", ")}.`,
          "Cook with basic pantry spices over medium heat until tender.",
          "Taste, adjust seasoning lightly, and serve warm."
        ];
      } else {
        // If no ingredients either, use fallback
        const fallbackRecipe = buildLocalFallbackRecipe(ingredients, prefs);
        return res.status(200).json({
          modelUsed: "local-fallback",
          fallback: true,
          ...fallbackRecipe
        });
      }
    }

    // Final validation
    const isValid =
      typeof recipe.title === 'string' &&
      recipe.title.length > 0 &&
      Array.isArray(recipe.cookingSteps) &&
      recipe.cookingSteps.length > 0 &&
      Array.isArray(recipe.usedIngredients) &&
      recipe.usedIngredients.length > 0 &&
      Number.isFinite(recipe.estimatedTime) &&
      recipe.estimatedTime > 0;

    if (!isValid) {
      console.error("[smart-recipe] Final validation failed, using fallback", {
        model,
        recipe
      });
      const fallbackRecipe = buildLocalFallbackRecipe(ingredients, prefs);
      return res.status(200).json({
        modelUsed: "local-fallback",
        fallback: true,
        ...fallbackRecipe
      });
    }

    res.json({
      modelUsed: model,
      ...recipe,
      usedIngredients: [...new Set((recipe.usedIngredients ?? []).map(s => String(s).toLowerCase()))],
      optionalIngredients: [...new Set((recipe.optionalIngredients ?? []).map(s => String(s).toLowerCase()))]
    });

  } catch (err) {
    if (err?.message === "All OpenRouter fallback models failed") {
      const fallbackRecipe = buildLocalFallbackRecipe(ingredients, prefs);
      console.warn("[smart-recipe] using local fallback recipe due to provider rate limits");
      return res.status(200).json({
        modelUsed: "local-fallback",
        fallback: true,
        ...fallbackRecipe
      });
    }

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
