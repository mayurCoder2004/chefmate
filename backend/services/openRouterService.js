import axios from "axios";
import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// Multiple Groq models for failover
const GROQ_MODELS = [
  'llama-3.3-70b-versatile',   // ← strong model first
  'llama-3.1-8b-instant',      // ← fast fallback
  'mixtral-8x7b-32768'         // ← last resort
]

// Lazy initialization of Groq client
let groq = null;
function getGroqClient() {
  if (!groq && process.env.GROQ_API_KEY) {
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
    console.log('[groq] initialized successfully with multi-model support:', GROQ_MODELS.join(', '));
  }
  return groq;
}

// Lazy initialization of Gemini client
let gemini = null;
function getGeminiClient() {
  if (!gemini && process.env.GEMINI_API_KEY) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    gemini = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('[gemini] initialized successfully with gemini-1.5-flash');
  }
  return gemini;
}
const FALLBACK_MODELS = (process.env.OPENROUTER_MODELS
  ? process.env.OPENROUTER_MODELS.split(",")
  : [
      "google/gemini-2.0-flash-exp:free",
      "meta-llama/llama-3.3-70b-instruct:free",
      "mistralai/mistral-7b-instruct:free",
      "qwen/qwen3-coder:free",
    ]
)
  .map((m) => m.trim())
  .filter(Boolean);
const MAX_RETRIES_PER_MODEL = Number(process.env.OPENROUTER_MAX_RETRIES ?? 1);
const REQUEST_TIMEOUT_MS = Number(process.env.OPENROUTER_TIMEOUT_MS ?? 15000);
const MAX_OUTPUT_TOKENS = Number(process.env.OPENROUTER_MAX_TOKENS ?? 1200);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Indian fallback recipes with proper names and authentic cooking steps
const INDIAN_FALLBACK_RECIPES = [
  {
    title: "Aloo Tamatar Sabzi",
    usedIngredients: ["potato", "tomato", "onion", "oil", "salt"],
    optionalIngredients: ["green chili", "coriander leaves", "jeera", "haldi"],
    healthBenefits: "Rich in vitamin C from tomatoes and provides energy from potatoes",
    cookingSteps: [
      "Heat oil in kadai, add jeera for tadka",
      "Add chopped onions and green chili, saute till golden",
      "Add haldi and diced potatoes, bhuno for 2 minutes",
      "Add chopped tomatoes and salt, cover and cook till potatoes are soft",
      "Garnish with coriander leaves and serve hot"
    ],
    estimatedTime: 20,
    servings: 2,
    estimatedCost: "₹15-20 per serving",
    cookingEquipment: "single burner + 1 kadai",
    notes: "Add a pinch of garam masala at the end for extra flavor"
  },
  {
    title: "Egg Bhurji",
    usedIngredients: ["eggs", "onion", "tomato", "oil", "salt"],
    optionalIngredients: ["green chili", "coriander leaves", "jeera", "red chili powder"],
    healthBenefits: "High protein meal perfect for muscle building and energy",
    cookingSteps: [
      "Heat oil in pan, add jeera for tadka",
      "Add finely chopped onions and green chili, saute till soft",
      "Add chopped tomatoes and masala, bhuno till oil separates",
      "Beat eggs and pour into pan, scramble continuously",
      "Cook till eggs are done, garnish with coriander"
    ],
    estimatedTime: 15,
    servings: 2,
    estimatedCost: "₹20-25 per serving",
    cookingEquipment: "single burner + 1 pan",
    notes: "Don't overcook eggs, keep them slightly moist for best taste"
  },
  {
    title: "Dal Tadka",
    usedIngredients: ["toor dal", "onion", "tomato", "ghee", "salt"],
    optionalIngredients: ["garlic", "green chili", "jeera", "haldi", "red chili powder"],
    healthBenefits: "Excellent source of protein and fiber for vegetarians",
    cookingSteps: [
      "Pressure cook dal with haldi and salt for 3 whistles",
      "Heat ghee in tadka pan, add jeera and garlic",
      "Add chopped onions and green chili, saute till golden",
      "Add tomatoes and masala, bhuno till soft",
      "Pour tadka over cooked dal, mix well and simmer for 2 minutes"
    ],
    estimatedTime: 25,
    servings: 3,
    estimatedCost: "₹12-15 per serving",
    cookingEquipment: "single burner + pressure cooker + tadka pan",
    notes: "Add a squeeze of lemon before serving for tangy flavor"
  },
  {
    title: "Poha",
    usedIngredients: ["poha", "onion", "potato", "oil", "salt"],
    optionalIngredients: ["peanuts", "green chili", "curry leaves", "haldi", "lemon"],
    healthBenefits: "Light and easy to digest, perfect breakfast option",
    cookingSteps: [
      "Rinse poha in water and drain immediately, sprinkle salt",
      "Heat oil, add mustard seeds and curry leaves for tadka",
      "Add peanuts and fry till golden, then add chopped onions",
      "Add diced potatoes, haldi and green chili, cook till soft",
      "Add poha, mix gently, cover and cook for 2 minutes, add lemon juice"
    ],
    estimatedTime: 15,
    servings: 2,
    estimatedCost: "₹10-15 per serving",
    cookingEquipment: "single burner + 1 kadai",
    notes: "Don't over-soak poha or it will become mushy"
  },
  {
    title: "Maggi Masala",
    usedIngredients: ["maggi noodles", "water", "maggi masala", "oil"],
    optionalIngredients: ["onion", "tomato", "green chili", "vegetables", "butter"],
    healthBenefits: "Quick energy boost for busy hostel days",
    cookingSteps: [
      "Heat oil in pan, add chopped onions and green chili",
      "Add chopped vegetables if using, saute for 2 minutes",
      "Add water and bring to boil",
      "Break maggi noodles, add to boiling water with masala",
      "Cook for 2 minutes stirring occasionally, add butter on top"
    ],
    estimatedTime: 10,
    servings: 1,
    estimatedCost: "₹15-20 per serving",
    cookingEquipment: "single burner + 1 pan",
    notes: "Add an egg while cooking for extra protein"
  },
  {
    title: "Jeera Rice",
    usedIngredients: ["rice", "jeera", "ghee", "salt", "water"],
    optionalIngredients: ["bay leaf", "green chili", "coriander leaves", "lemon juice"],
    healthBenefits: "Light and aromatic, aids in digestion",
    cookingSteps: [
      "Wash and soak rice for 10 minutes, drain",
      "Heat ghee in pressure cooker, add jeera and bay leaf for tadka",
      "Add drained rice, saute for 1 minute",
      "Add water (1:2 rice to water ratio) and salt",
      "Pressure cook for 2 whistles, let steam release naturally"
    ],
    estimatedTime: 20,
    servings: 2,
    estimatedCost: "₹15-20 per serving",
    cookingEquipment: "single burner + pressure cooker",
    notes: "Fluff with fork after cooking for best texture"
  },
  {
    title: "Bread Upma",
    usedIngredients: ["bread slices", "onion", "oil", "salt"],
    optionalIngredients: ["green chili", "curry leaves", "mustard seeds", "vegetables"],
    healthBenefits: "Quick way to use leftover bread, filling breakfast option",
    cookingSteps: [
      "Cut bread into small cubes, lightly toast if desired",
      "Heat oil, add mustard seeds and curry leaves for tadka",
      "Add chopped onions and green chili, saute till soft",
      "Add vegetables if using, cook for 2 minutes",
      "Add bread cubes and salt, mix well and cook for 2 minutes"
    ],
    estimatedTime: 12,
    servings: 2,
    estimatedCost: "₹10-12 per serving",
    cookingEquipment: "single burner + 1 pan",
    notes: "Don't add water, bread will become soggy"
  },
  {
    title: "Masala Omelette",
    usedIngredients: ["eggs", "onion", "tomato", "oil", "salt"],
    optionalIngredients: ["green chili", "coriander leaves", "red chili powder", "black pepper"],
    healthBenefits: "Protein-rich meal perfect for post-workout or breakfast",
    cookingSteps: [
      "Beat eggs with salt, pepper and red chili powder",
      "Add finely chopped onions, tomatoes, green chili and coriander",
      "Heat oil in pan till medium hot",
      "Pour egg mixture, spread evenly",
      "Cook on medium flame till bottom is golden, flip and cook other side"
    ],
    estimatedTime: 10,
    servings: 1,
    estimatedCost: "₹20-25 per serving",
    cookingEquipment: "single burner + 1 pan",
    notes: "Use non-stick pan for easy flipping"
  },
  {
    title: "Khichdi",
    usedIngredients: ["rice", "moong dal", "ghee", "salt", "haldi"],
    optionalIngredients: ["jeera", "ginger", "green chili", "vegetables", "hing"],
    healthBenefits: "Complete comfort food, easy to digest and nutritious",
    cookingSteps: [
      "Wash rice and dal together, soak for 10 minutes",
      "Heat ghee in pressure cooker, add jeera and hing for tadka",
      "Add ginger and green chili, saute briefly",
      "Add rice-dal mixture, haldi and vegetables if using",
      "Add water (1:3 ratio), salt and pressure cook for 3 whistles"
    ],
    estimatedTime: 25,
    servings: 2,
    estimatedCost: "₹15-18 per serving",
    cookingEquipment: "single burner + pressure cooker",
    notes: "Serve with pickle or papad for complete meal"
  },
  {
    title: "Aloo Paratha",
    usedIngredients: ["wheat flour", "potato", "oil", "salt"],
    optionalIngredients: ["green chili", "coriander leaves", "jeera", "red chili powder", "butter"],
    healthBenefits: "Filling and nutritious, provides sustained energy",
    cookingSteps: [
      "Boil and mash potatoes, mix with salt, chili powder and coriander",
      "Knead wheat flour with water and salt to make soft dough",
      "Take dough ball, roll slightly, place potato filling inside",
      "Seal and roll into flat paratha carefully",
      "Cook on hot tawa with oil/ghee till golden brown on both sides"
    ],
    estimatedTime: 30,
    servings: 3,
    estimatedCost: "₹12-15 per serving",
    cookingEquipment: "single burner + tawa + rolling pin",
    notes: "Serve hot with curd or pickle"
  }
];

// Smart fallback recipe selection based on ingredients
function getIndianFallbackRecipe(options) {
  const ingredients = options.ingredients || [];
  const ingredientsLower = ingredients.map(i => i.toLowerCase());
  
  // Try to match ingredients with appropriate recipes
  if (ingredientsLower.some(i => i.includes('egg'))) {
    const eggRecipes = INDIAN_FALLBACK_RECIPES.filter(r => 
      r.title.includes('Egg') || r.title.includes('Omelette')
    );
    if (eggRecipes.length > 0) {
      console.log('[fallback] matched egg-based recipe');
      return {
        text: JSON.stringify(eggRecipes[0]),
        model: 'fallback/indian-recipe'
      };
    }
  }
  
  if (ingredientsLower.some(i => i.includes('besan') || i.includes('gram flour'))) {
    // If besan is provided with potato, prefer Aloo Pakora or similar
    if (ingredientsLower.some(i => i.includes('potato') || i.includes('aloo'))) {
      console.log('[fallback] matched besan+potato combination, using Aloo Paratha');
      const alooParatha = INDIAN_FALLBACK_RECIPES.find(r => r.title.includes('Aloo Paratha'));
      if (alooParatha) {
        return {
          text: JSON.stringify(alooParatha),
          model: 'fallback/indian-recipe'
        };
      }
    }
  }
  
  if (ingredientsLower.some(i => i.includes('potato') || i.includes('aloo'))) {
    const potatoRecipes = INDIAN_FALLBACK_RECIPES.filter(r => 
      r.title.includes('Aloo') || r.usedIngredients.some(ing => ing.includes('potato'))
    );
    if (potatoRecipes.length > 0) {
      console.log('[fallback] matched potato-based recipe');
      return {
        text: JSON.stringify(potatoRecipes[0]),
        model: 'fallback/indian-recipe'
      };
    }
  }
  
  if (ingredientsLower.some(i => i.includes('maggi') || i.includes('noodle'))) {
    const maggiRecipe = INDIAN_FALLBACK_RECIPES.find(r => r.title.includes('Maggi'));
    if (maggiRecipe) {
      console.log('[fallback] matched maggi recipe');
      return {
        text: JSON.stringify(maggiRecipe),
        model: 'fallback/indian-recipe'
      };
    }
  }
  
  if (ingredientsLower.some(i => i.includes('poha'))) {
    const pohaRecipe = INDIAN_FALLBACK_RECIPES.find(r => r.title.includes('Poha'));
    if (pohaRecipe) {
      console.log('[fallback] matched poha recipe');
      return {
        text: JSON.stringify(pohaRecipe),
        model: 'fallback/indian-recipe'
      };
    }
  }
  
  if (ingredientsLower.some(i => i.includes('rice')) && ingredientsLower.some(i => i.includes('dal'))) {
    const khichdiRecipe = INDIAN_FALLBACK_RECIPES.find(r => r.title.includes('Khichdi'));
    if (khichdiRecipe) {
      console.log('[fallback] matched khichdi recipe');
      return {
        text: JSON.stringify(khichdiRecipe),
        model: 'fallback/indian-recipe'
      };
    }
  }
  
  if (ingredientsLower.some(i => i.includes('dal') || i.includes('lentil'))) {
    const dalRecipe = INDIAN_FALLBACK_RECIPES.find(r => r.title.includes('Dal'));
    if (dalRecipe) {
      console.log('[fallback] matched dal recipe');
      return {
        text: JSON.stringify(dalRecipe),
        model: 'fallback/indian-recipe'
      };
    }
  }
  
  if (ingredientsLower.some(i => i.includes('bread'))) {
    const breadRecipe = INDIAN_FALLBACK_RECIPES.find(r => r.title.includes('Bread'));
    if (breadRecipe) {
      console.log('[fallback] matched bread recipe');
      return {
        text: JSON.stringify(breadRecipe),
        model: 'fallback/indian-recipe'
      };
    }
  }
  
  // If no specific match, return a random Indian recipe
  const randomRecipe = INDIAN_FALLBACK_RECIPES[Math.floor(Math.random() * INDIAN_FALLBACK_RECIPES.length)];
  console.log('[fallback] using random indian recipe:', randomRecipe.title);
  return {
    text: JSON.stringify(randomRecipe),
    model: 'fallback/indian-recipe'
  };
}

function parseContent(choice) {
  if (!choice) return "";
  const content = choice.message?.content;
  if (typeof content === "string") return content;
  if (content && typeof content === "object" && !Array.isArray(content)) {
    return JSON.stringify(content);
  }
  if (Array.isArray(content)) {
    const joined = content
      .map((c) => {
        if (typeof c === "string") return c;
        if (typeof c?.text === "string") return c.text;
        if (c && typeof c === "object" && typeof c?.content === "string") return c.content;
        if (c && typeof c === "object") return JSON.stringify(c);
        return "";
      })
      .filter(Boolean)
      .join("\n");
    if (joined) return joined;
  }
  if (typeof choice.text === "string") return choice.text;
  if (choice.text && typeof choice.text === "object") return JSON.stringify(choice.text);
  return "";
}

function hasUsableOutput(response, text) {
  const choice = response?.data?.choices?.[0];
  const content = choice?.message?.content;
  if (typeof text === "string" && text.trim().length > 0) return true;
  if (content && typeof content === "object") return true;
  return false;
}

function buildErrorSummary(errors) {
  return errors.map((e) => ({
    model: e.model,
    status: e.status || null,
    message: e.message
  }));
}

// Call Groq API with multi-model failover support
async function callGroq({ messages, temperature = 0.5 }) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("Missing GROQ_API_KEY");
  }

  const groqClient = getGroqClient();
  if (!groqClient) {
    throw new Error("Failed to initialize Groq client");
  }

  const modelErrors = [];

  // Try each Groq model sequentially
  for (const modelName of GROQ_MODELS) {
    try {
      console.log(`[groq] trying model: ${modelName}`);
      
      const completion = await groqClient.chat.completions.create({
        messages,
        model: modelName,
        temperature,
        response_format: { type: 'json_object' }
      });

      const text = completion.choices?.[0]?.message?.content || '';
      
      if (!text || text.trim().length === 0) {
        console.log(`[groq] failed model=${modelName}: empty response`);
        modelErrors.push({ model: modelName, error: 'Empty response' });
        continue; // Try next model
      }

      console.log(`[groq] success model=${modelName}`);
      
      return {
        text,
        model: `groq/${modelName}`
      };
      
    } catch (err) {
      const errorMessage = err.message || 'Unknown error';
      console.log(`[groq] failed model=${modelName}: ${errorMessage}`);
      modelErrors.push({ model: modelName, error: errorMessage });
      
      // Check if model is decommissioned or rate limited
      const isDecommissioned = errorMessage.includes('decommissioned') || errorMessage.includes('not found');
      const isRateLimit = errorMessage.includes('rate') || errorMessage.includes('429');
      
      if (isDecommissioned) {
        console.log(`[groq] model ${modelName} is decommissioned, skipping to next model`);
        continue; // Skip to next model immediately
      }
      
      if (isRateLimit) {
        console.log(`[groq] model ${modelName} rate limited, trying next model`);
        continue; // Try next model
      }
      
      // For other errors, continue to next model
      console.log(`[groq] switching to next Groq model`);
    }
  }

  // All Groq models failed
  console.log('[groq] all Groq models failed');
  const error = new Error('All Groq models failed');
  error.details = modelErrors;
  throw error;
}

// Call Gemini API with proper error handling
async function callGemini({ messages, temperature = 0.5 }) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const geminiClient = getGeminiClient();
  if (!geminiClient) {
    throw new Error("Failed to initialize Gemini client");
  }

  console.log('[gemini] trying secondary provider');

  try {
    // Convert messages to Gemini format
    // Gemini expects a single prompt, so we'll combine system and user messages
    const systemMessage = messages.find(m => m.role === 'system')?.content || '';
    const userMessage = messages.find(m => m.role === 'user')?.content || '';
    const combinedPrompt = systemMessage ? `${systemMessage}\n\n${userMessage}` : userMessage;

    const result = await geminiClient.generateContent({
      contents: [{ role: 'user', parts: [{ text: combinedPrompt }] }],
      generationConfig: {
        temperature,
        responseMimeType: 'application/json'
      }
    });

    const response = await result.response;
    const text = response.text();
    
    if (!text || text.trim().length === 0) {
      throw new Error('Empty response from Gemini');
    }

    console.log('[gemini] success');
    
    return {
      text,
      model: 'gemini/gemini-1.5-flash'
    };
    
  } catch (err) {
    const errorMessage = err.message || 'Unknown error';
    console.log(`[gemini] failed: ${errorMessage}`);
    throw new Error(`Gemini API error: ${errorMessage}`);
  }
}

// Call OpenRouter API (existing logic preserved)
async function callOpenRouter({ messages, temperature, stream, extraPayload }) {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("Missing OPENROUTER_API_KEY");
  }

  const modelErrors = [];

  for (const model of FALLBACK_MODELS) {
    for (let attempt = 0; attempt <= MAX_RETRIES_PER_MODEL; attempt += 1) {
      try {
        const response = await axios.post(
          OPENROUTER_URL,
          {
            model,
            messages,
            temperature,
            stream,
            max_tokens: MAX_OUTPUT_TOKENS,
            ...extraPayload
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
              "Content-Type": "application/json"
            },
            timeout: REQUEST_TIMEOUT_MS
          }
        );

        const text = parseContent(response.data?.choices?.[0] || null);
        const finishReason = response?.data?.choices?.[0]?.finish_reason
          || response?.data?.choices?.[0]?.native_finish_reason
          || null;

        if (finishReason === 'length') {
          const err = new Error(`Model output truncated (finish_reason=length) — JSON will be incomplete`);
          err.status = 502;
          throw err;
        }

        if (!hasUsableOutput(response, text)) {
          const err = new Error(`Empty/invalid model output (finish_reason=${finishReason || 'unknown'})`);
          err.status = 502;
          throw err;
        }

        console.log(`[openrouter] success model=${model} attempt=${attempt + 1}`);
        return {
          model,
          response,
          text
        };
      } catch (err) {
        const status = err.response?.status;
        const message =
          err.response?.data?.error?.message ||
          err.response?.data?.message ||
          err.message ||
          "OpenRouter request failed";

        modelErrors.push({ model, status, message, attempt: attempt + 1 });

        const isRateLimit = status === 429;
        const isLastAttempt = attempt >= MAX_RETRIES_PER_MODEL;
        const isRetriable = !status || status >= 500;

        if (isRateLimit) {
          console.warn(`[openrouter] rate-limited model=${model}, trying next fallback model`);
          break;
        }

        if (!isLastAttempt && isRetriable) {
          const backoffMs = 600 * (attempt + 1);
          await sleep(backoffMs);
          continue;
        }

        break;
      }
    }
  }

  const error = new Error("All OpenRouter fallback models failed");
  error.statusCode = 502;
  error.details = buildErrorSummary(modelErrors);
  throw error;
}

export async function callOpenRouterWithFallback({
  messages,
  temperature = 0.6,
  stream = false,
  extraPayload = {},
  ingredients = []
}) {
  // Try Groq multi-model system first (primary provider)
  try {
    console.log('[groq] trying primary provider');
    const result = await callGroq({ messages, temperature });
    console.log('[groq] success');
    return result;
  } catch (groqErr) {
    console.warn('[groq] failed:', groqErr.message);
    
    // Try Gemini as secondary provider
    try {
      console.log('[gemini] trying secondary provider');
      const result = await callGemini({ messages, temperature });
      console.log('[gemini] success');
      return result;
    } catch (geminiErr) {
      console.warn('[gemini] failed:', geminiErr.message);
      
      // Try OpenRouter as tertiary provider
      try {
        console.log('[openrouter] trying tertiary provider');
        const result = await callOpenRouter({ 
          messages, 
          temperature, 
          stream, 
          extraPayload 
        });
        console.log('[openrouter] success');
        return result;
      } catch (openRouterErr) {
        console.warn('[openrouter] failed:', openRouterErr.message);
        console.log('[fallback] using emergency Indian fallback recipe');
        
        // Use Indian fallback recipe as last resort
        return getIndianFallbackRecipe({ ingredients });
      }
    }
  }
}

