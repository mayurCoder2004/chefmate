import express from "express";
import { z } from "zod";
import { callOpenRouterWithFallback } from "../services/openRouterService.js";
import { recipeLimiter } from "../middlewares/rateLimit.js";
import { authOptional } from "../middlewares/auth.js";

const router = express.Router();

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

// Banned generic titles that should trigger retry
const BANNED_TITLE_TERMS = [
  'quick bowl',
  'rice bowl',
  'veggie mix',
  'stir fry',
  'easy mix',
  'tomato bowl',
  'simple bowl',
  'veggie bowl',
  'mixed bowl',
  'instant bowl'
];

// Check if title is generic/banned
function isGenericTitle(title) {
  if (!title || typeof title !== 'string') return true;
  const titleLower = title.toLowerCase().trim();
  
  // Check against banned terms
  for (const banned of BANNED_TITLE_TERMS) {
    if (titleLower.includes(banned)) {
      console.log(`[validation] rejected generic title: "${title}" (contains "${banned}")`);
      return true;
    }
  }
  
  // Check if title is too short or generic
  if (titleLower.length < 5) {
    console.log(`[validation] rejected title: too short`);
    return true;
  }
  
  return false;
}

// Calculate ingredient overlap between user ingredients and recipe ingredients
function calculateIngredientOverlap(recipeIngredients, userIngredients) {
  if (!Array.isArray(recipeIngredients) || !Array.isArray(userIngredients)) {
    return { overlap: 0, percentage: 0, matches: [] };
  }
  
  const userIngredientsLower = userIngredients.map(i => i.toLowerCase().trim());
  const recipeIngredientsLower = recipeIngredients.map(i => i.toLowerCase().trim());
  
  const matches = [];
  let overlapCount = 0;
  
  for (const userIng of userIngredientsLower) {
    for (const recipeIng of recipeIngredientsLower) {
      // Check for partial matches (e.g., "potato" matches "potatoes", "aloo")
      if (
        recipeIng.includes(userIng) || 
        userIng.includes(recipeIng) ||
        (userIng === 'potato' && recipeIng.includes('aloo')) ||
        (userIng === 'aloo' && recipeIng.includes('potato'))
      ) {
        overlapCount++;
        matches.push({ user: userIng, recipe: recipeIng });
        break; // Count each user ingredient only once
      }
    }
  }
  
  const percentage = overlapCount / Math.max(userIngredientsLower.length, 1);
  
  return {
    overlap: overlapCount,
    percentage,
    matches,
    total: userIngredientsLower.length
  };
}

// Validate recipe relevance to user ingredients
function validateRecipeRelevance(recipe, userIngredients, minOverlapPercentage = 0.5) {
  const errors = [];
  
  // Check if recipe has used ingredients
  if (!Array.isArray(recipe.usedIngredients) || recipe.usedIngredients.length === 0) {
    errors.push('Recipe has no usedIngredients');
    return { valid: false, errors, overlapData: null };
  }
  
  // Calculate ingredient overlap
  const overlapData = calculateIngredientOverlap(recipe.usedIngredients, userIngredients);
  
  console.log(`[validation] ingredient overlap: ${overlapData.overlap}/${overlapData.total} (${(overlapData.percentage * 100).toFixed(0)}%)`);
  console.log(`[validation] matches:`, overlapData.matches);
  
  // Check if overlap meets minimum threshold
  if (overlapData.percentage < minOverlapPercentage) {
    errors.push(`Low ingredient relevance: ${(overlapData.percentage * 100).toFixed(0)}% (minimum ${(minOverlapPercentage * 100).toFixed(0)}%)`);
  }
  
  // Check for generic title
  if (isGenericTitle(recipe.title)) {
    errors.push('Generic or banned title');
  }
  
  const valid = errors.length === 0;
  
  if (valid) {
    console.log(`[validation] recipe accepted: "${recipe.title}"`);
  } else {
    console.log(`[validation] recipe rejected:`, errors);
  }
  
  return { valid, errors, overlapData };
}

// ============================================================================
// SCHEMA VALIDATION
// ============================================================================

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

// ============================================================================
// JSON EXTRACTION & VALIDATION
// ============================================================================

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

const REQUIRED_RECIPE_FIELDS = ['title', 'cookingSteps', 'usedIngredients', 'estimatedCost'];

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
  if (typeof obj.estimatedCost !== 'string' || !obj.estimatedCost.includes('₹')) return false;
  return true;
}

// ============================================================================
// IMPROVED PROMPT GENERATION
// ============================================================================

function buildSystemPrompt() {
  return `You are an expert Indian home cook specializing in hostel and bachelor cooking. 
You ONLY create authentic Indian recipes using traditional Indian cooking methods.
You have never heard of Western dishes like "Quick Bowl", "Stir Fry", "Rice Bowl", or "Veggie Mix".
You MUST use the user's provided ingredients as the PRIMARY ingredients in your recipe.
You only output valid JSON. No text, no markdown, no explanations.`;
}

function buildUserPrompt(ingredients, prefs) {
  const ingredientList = ingredients.join(", ");
  
  return `CRITICAL RULES - YOU MUST FOLLOW THESE:

1. INGREDIENT USAGE (MOST IMPORTANT):
   - The recipe MUST primarily use these ingredients: ${ingredientList}
   - At least 70% of the core ingredients must come from the provided list
   - DO NOT generate unrelated dishes that ignore the provided ingredients
   - If ingredients include "besan" and "potato", create a recipe that naturally uses BOTH besan AND potato together
   - The recipe title MUST accurately reflect the primary ingredients used

2. RECIPE AUTHENTICITY:
   - Generate ONLY authentic Indian recipes with proper Indian names
   - Use Hindi or English names for dishes
   - ✅ CORRECT: "Besan Aloo Sabzi", "Aloo Pakora", "Besan Chilla", "Dal Tadka", "Egg Bhurji"
   - ❌ WRONG: "Quick Bowl", "Veggie Stir Fry", "Rice Bowl", "Tomato Soup", "Easy Mix"

3. COOKING CONTEXT:
   - Single burner cooking only (no oven)
   - Budget under ₹50
   - Realistic for hostel/bachelor cooking
   - Diet preference: ${prefs.diet}${prefs.maxTime ? `\n   - Maximum cooking time: ${prefs.maxTime} minutes` : ''}

4. OUTPUT FORMAT:
   Output ONLY this exact JSON structure (no markdown, no code blocks):
   {
     "title": "Authentic Indian dish name that reflects the main ingredients",
     "usedIngredients": ["${ingredients[0]}", "${ingredients[1] || 'ingredient 2'}", "oil", "salt"],
     "optionalIngredients": ["green chili", "coriander leaves", "spices"],
     "healthBenefits": "One short sentence about nutritional benefits",
     "cookingSteps": [
       "Step 1: Detailed first step using Indian cooking terms",
       "Step 2: Continue with tadka, bhuno, saute techniques",
       "Step 3: More detailed steps",
       "Step 4: Continue cooking process",
       "Step 5: Final step and serving"
     ],
     "estimatedTime": 20,
     "servings": 2,
     "estimatedCost": "₹25-30 per serving",
     "cookingEquipment": "single burner + 1 kadai",
     "notes": "One practical hostel cooking tip"
   }

5. COOKING STEPS REQUIREMENTS:
   - Use authentic Indian cooking terminology: tadka, bhuno, saute, jeera, haldi, masala
   - Be specific and detailed
   - Include timing and temperature guidance
   - Mention when to add each ingredient

Remember: The recipe MUST use the provided ingredients (${ingredientList}) as PRIMARY ingredients. Do not ignore them!`;
}

// ============================================================================
// AI GENERATION WITH RETRY LOGIC
// ============================================================================

async function generateRecipeWithRetry(ingredients, prefs, maxRetries = 2) {
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(ingredients, prefs);
  
  let lastError = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) {
      console.log(`[retry] attempt ${attempt}/${maxRetries}`);
    }
    
    try {
      // Call AI provider
      const { text, model } = await callOpenRouterWithFallback({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.5,
        stream: false,
        extraPayload: {
          response_format: { type: "json_object" }
        },
        ingredients: ingredients || []
      });
      
      console.log(`[validation] received response from ${model}`);
      
      // Parse JSON
      const recipe = extractJSON(text);
      
      if (!recipe) {
        console.log(`[validation] JSON parse failed`);
        lastError = new Error("Failed to parse JSON response");
        continue; // Retry
      }
      
      console.log(`[validation] parsed JSON successfully`);
      
      // Validate basic structure
      if (!isValidRecipe(recipe)) {
        console.log(`[validation] missing required fields:`, Object.keys(recipe));
        lastError = new Error("Recipe missing required fields");
        continue; // Retry
      }
      
      console.log(`[validation] basic structure valid`);
      
      // Validate ingredient relevance
      const relevanceCheck = validateRecipeRelevance(recipe, ingredients, 0.5);
      
      if (!relevanceCheck.valid) {
        console.log(`[validation] relevance check failed:`, relevanceCheck.errors);
        lastError = new Error(`Recipe validation failed: ${relevanceCheck.errors.join(', ')}`);
        continue; // Retry
      }
      
      // Success!
      console.log(`[validation] recipe fully validated and accepted`);
      return { recipe, model, overlapData: relevanceCheck.overlapData };
      
    } catch (err) {
      console.log(`[retry] generation failed:`, err.message);
      lastError = err;
      
      // If this is the last attempt, throw
      if (attempt === maxRetries) {
        throw err;
      }
      
      // Otherwise, continue to retry
    }
  }
  
  // If we exhausted all retries
  throw lastError || new Error("Recipe generation failed after retries");
}

// ============================================================================
// ROUTE HANDLER
// ============================================================================

router.post("/", authOptional, recipeLimiter, async (req, res) => {
  const parsed = RecipeBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
  }

  const { prompt, ingredients, prefs = { diet: "none" } } = parsed.data;
  
  // Use ingredients array or parse from prompt
  const userIngredients = ingredients || (prompt ? [prompt] : []);
  
  console.log(`[recipe-generation] starting for ingredients:`, userIngredients);
  console.log(`[recipe-generation] preferences:`, prefs);

  try {
    // Generate recipe with retry logic
    const { recipe, model, overlapData } = await generateRecipeWithRetry(
      userIngredients,
      prefs,
      2 // max retries
    );
    
    console.log(`[recipe-generation] success with model: ${model}`);
    console.log(`[recipe-generation] final overlap: ${overlapData.overlap}/${overlapData.total} (${(overlapData.percentage * 100).toFixed(0)}%)`);
    
    return res.json({ 
      modelUsed: model, 
      recipe,
      _debug: {
        ingredientOverlap: overlapData.overlap,
        ingredientTotal: overlapData.total,
        overlapPercentage: Math.round(overlapData.percentage * 100)
      }
    });
    
  } catch (err) {
    console.error(`[recipe-generation] failed after all retries:`, err.message);
    
    // Return error response
    const status = err.statusCode || 500;
    return res.status(status).json({
      error: err.message || "Recipe generation failed",
      details: err.details || undefined
    });
  }
});

export default router;

