import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import mealPlanRoutes from "./routes/mealPlanRoutes.js";
import axios from "axios";
import { z } from "zod";

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
  const match = str.match(/(\{[\s\S]*\})|(\[[\s\S]*\])/);
  if (match) {
    try { return JSON.parse(match[0]); } catch {}
  }
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
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-small-3.2-24b-instruct:free', // Updated Mistral free model
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: [{ type: 'text', text: user }] }
        ],
        temperature: 0.6,
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const choice = response.data?.choices?.[0];
    let text = '';
    if (choice) {
      if (typeof choice.message?.content === 'string') text = choice.message.content;
      else if (Array.isArray(choice.message?.content)) text = choice.message.content.map(c => c.text || '').join('\n');
      else if (typeof choice.text === 'string') text = choice.text;
    }

    const recipe = extractJSON(text);

    if (!recipe) return res.status(502).json({ error: 'AI returned invalid JSON', rawText: text });

    const ok =
      typeof recipe.title === 'string' &&
      Array.isArray(recipe.cookingSteps) &&
      typeof recipe.estimatedTime === 'number';

    if (!ok) return res.status(502).json({ error: 'AI JSON missing required fields', raw: recipe });

    res.json({
      ...recipe,
      usedIngredients: [...new Set((recipe.usedIngredients ?? []).map(s => String(s).toLowerCase()))],
      optionalIngredients: [...new Set((recipe.optionalIngredients ?? []).map(s => String(s).toLowerCase()))]
    });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'LLM request failed' });
  }
});

// ------------------------
// Ping endpoint
// ------------------------
app.get('/ping', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
