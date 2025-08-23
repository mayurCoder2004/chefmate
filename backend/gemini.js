import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/** Utility: safe JSON parse */
function safeParseJSON(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

/**
 * Get a smart recipe using Gemini API
 */
export async function getSmartRecipe({ ingredients, prefs }) {
  const system = `
You are a professional chef and nutrition coach.
Use ONLY the provided ingredients as core items. Pantry items (oil, salt, pepper, spices) are okay.
Optimize for health (balanced macros, low processed foods, sensible sodium) and taste.
Respond ONLY in valid JSON with this structure:
{
  "title": string,
  "usedIngredients": string[],
  "optionalIngredients": string[],
  "healthBenefits": string,
  "cookingSteps": string[],
  "estimatedTime": number,
  "servings": number,
  "notes": string
}
`;

  const user = `
Ingredients: ${ingredients.join(", ")}
Diet: ${prefs.diet}
${prefs.maxTime ? `MaxTime: ${prefs.maxTime} minutes` : ""}
Return ONE best recipe in strict JSON format.
`;

  // ✅ Use Gemini 2.0 model (your key is for this!)
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent([system, user]);
  const text = result.response.text();

  const recipe = safeParseJSON(text);
  if (!recipe) throw new Error("Gemini returned invalid JSON");

  const ok =
    typeof recipe.title === "string" &&
    Array.isArray(recipe.cookingSteps) &&
    typeof recipe.estimatedTime === "number";

  if (!ok) throw new Error("Gemini JSON missing required fields");

  return {
    ...recipe,
    usedIngredients: [
      ...new Set((recipe.usedIngredients ?? []).map((s) => String(s).toLowerCase())),
    ],
    optionalIngredients: [
      ...new Set((recipe.optionalIngredients ?? []).map((s) => String(s).toLowerCase())),
    ],
  };
}
