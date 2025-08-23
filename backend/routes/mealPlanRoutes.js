import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import axios from "axios";
import { z } from "zod";

const router = express.Router();

const MealPlanBody = z.object({
  days: z.number().int().min(1).max(14),
  diet: z.enum(['none','veg','vegan','keto','paleo']).default('none'),
  calories: z.number().positive().optional()
});

// Safely extract JSON from AI text
function extractJSON(str) {
  const match = str.match(/(\{[\s\S]*\})|(\[[\s\S]*\])/);
  if (match) {
    try { return JSON.parse(match[0]); } catch {}
  }
  return null;
}

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
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-small-3.2-24b-instruct:free',
        messages: [{ role: 'system', content: systemPrompt }],
        temperature: 0.6
      },
      { headers: { 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`, 'Content-Type': 'application/json' } }
    );

    const text = response.data?.choices?.[0]?.message?.content || '';
    const mealPlan = extractJSON(text);

    if (!mealPlan) return res.status(502).json({ error: 'AI returned invalid JSON', rawText: text });

    res.json({ mealPlan });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'LLM request failed' });
  }
});

export default router;
