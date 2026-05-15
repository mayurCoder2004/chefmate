import { useMemo, useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import toast, { Toaster } from 'react-hot-toast';
import {
  ChefHat, Search, RotateCcw, Salad, Timer, Share2, Bookmark,
  Utensils, Leaf, ShoppingCart, Package, Users, FileText,
  Heart, XCircle, Check, ChevronDown, ChevronUp, Wheat, Carrot,
  Milk, Flame, Drumstick, Soup
} from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import { authenticatedFetch, apiFetch } from '../utils/apiClient';

const CATEGORIZED_INGREDIENTS = {
  "Grains & Bread": { icon: Wheat, items: ["chawal", "aata", "bread", "poha", "oats", "maggi", "suji", "roti"] },
  "Vegetables": { icon: Carrot, items: ["onion", "tomato", "potato", "green chili", "garlic", "ginger"] },
  "Dairy & Eggs": { icon: Milk, items: ["egg", "milk", "curd", "paneer", "butter", "ghee"] },
  "Spices": { icon: Flame, items: ["salt", "turmeric", "jeera", "garam masala", "red chili powder"] },
  "Protein & Dal": { icon: Drumstick, items: ["dal", "besan", "chicken"] },
  "Extras": { icon: Soup, items: ["oil", "ketchup", "peanut butter", "lemon", "maggi masala"] }
};

const PREDEFINED_INGREDIENTS = Object.values(CATEGORIZED_INGREDIENTS).flatMap(cat => cat.items);

export default function SmartRecipe() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  
  const [customInput, setCustomInput] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [diet, setDiet] = useState('none');
  const [maxTime, setMaxTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const recipeRef = useRef(null);

  // Dynamic limits based on Auth
  const MAX_DAILY_RECIPES = user ? 15 : 3;
  const [dailyUsage, setDailyUsage] = useState(0);
  const [hasGeneratedRecipe, setHasGeneratedRecipe] = useState(false);

  // Accordion state
  const [expandedCategories, setExpandedCategories] = useState(
    Object.keys(CATEGORIZED_INGREDIENTS).reduce((acc, cat) => ({ ...acc, [cat]: true }), {})
  );

  // Initialize usage based on User ID or Guest
  useEffect(() => {
    const userId = user?.id || user?._id || 'guest';
    const usageKey = `chefmate_usage_${userId}`;
    const dateKey = `chefmate_usage_date_${userId}`;
    
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem(dateKey);
    const storedUsage = parseInt(localStorage.getItem(usageKey) || '0', 10);

    if (storedDate === today) {
      setDailyUsage(storedUsage);
      setHasGeneratedRecipe(storedUsage > 0);
    } else {
      localStorage.setItem(dateKey, today);
      localStorage.setItem(usageKey, '0');
      setDailyUsage(0);
      setHasGeneratedRecipe(false);
    }
  }, [user]); // Re-run when user logs in/out

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const canSubmit = useMemo(
    () => selectedIngredients.length > 0 && !loading && dailyUsage < MAX_DAILY_RECIPES,
    [selectedIngredients, loading, dailyUsage, MAX_DAILY_RECIPES]
  );

  function toArray(value) {
    if (Array.isArray(value)) return value.filter(Boolean).map(x => String(x).trim()).filter(Boolean);
    if (typeof value === 'string') return value.split(/\n|,|;|\d+\.\s+/).map(x => x.trim()).filter(Boolean);
    return [];
  }

  function normalizeRecipePayload(data) {
    if (!data || typeof data !== 'object') return null;
    const src = data.recipe && typeof data.recipe === 'object' ? data.recipe : data;
    return {
      ...src,
      title: String(src.title || 'Untitled Recipe'),
      estimatedTime: Number(src.estimatedTime) || 0,
      servings: src.servings ? Number(src.servings) : undefined,
      usedIngredients: toArray(src.usedIngredients),
      optionalIngredients: toArray(src.optionalIngredients),
      healthBenefits: toArray(src.healthBenefits),
      cookingSteps: toArray(src.cookingSteps),
    };
  }

  async function fetchSmartRecipe() {
    setLoading(true); setError(''); setRecipe(null);
    toast.loading('AI Chef is analyzing your ingredients...', { id: 'recipe-loading' });
    
    try {
      const token = localStorage.getItem('token');
      const API_BASE = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

      const res = await fetch(`${API_BASE}/api/smart-recipe`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({ 
          ingredients: selectedIngredients, 
          prefs: { diet, ...(maxTime ? { maxTime: Number(maxTime) } : {}) } 
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate recipe');

      const normalized = normalizeRecipePayload(data);
      if (!normalized) throw new Error('Recipe payload is invalid');

      setRecipe(normalized);
      
      // Update usage in specific user key
      const userId = user?.id || user?._id || 'guest';
      const usageKey = `chefmate_usage_${userId}`;
      const newUsage = dailyUsage + 1;
      
      setDailyUsage(newUsage);
      setHasGeneratedRecipe(true);
      localStorage.setItem(usageKey, String(newUsage));
      
      toast.dismiss('recipe-loading');
      toast.success('Perfect recipe created!');
      setTimeout(() => { recipeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 200);
    } catch (e) {
      toast.dismiss('recipe-loading');
      setError(e.message);
      toast.error(`Oops! ${e.message}`);
    } finally { setLoading(false); }
  }

  // Helper functions for UI
  const toggleIngredient = (name) => {
    setSelectedIngredients(prev => prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]);
  };

  const handleCustomInput = (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const raw = customInput.trim().toLowerCase();
    if (!raw) return;
    setSelectedIngredients(prev => [...new Set([...prev, raw])].slice(0, 20));
    setCustomInput('');
  };

  async function saveRecipe() {
    if (!recipe || !user) return toast.error("Please login to save recipes");
    setSaving(true);
    try {
      const res = await authenticatedFetch('/api/recipes/save', {
        method: 'POST',
        body: JSON.stringify(recipe)
      }, () => { logout(); navigate('/login'); });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Saved to your profile!");
    } catch (err) {
      toast.error(err.message);
    } finally { setSaving(false); }
  }

  const customChips = selectedIngredients.filter(i => !PREDEFINED_INGREDIENTS.includes(i));

  return (
    <div className="min-h-screen pb-20 pt-28 px-4" style={{ backgroundColor: '#FDF6EE' }}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center justify-center gap-2 mb-2">
            <ChefHat size={24} className="text-orange-500" /> Smart Recipe
          </h1>
          <p className="text-sm text-gray-600">Pick your ingredients and get an AI-generated recipe.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5 shadow-sm">
          {/* Ingredient Selection */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {Object.entries(CATEGORIZED_INGREDIENTS).map(([category, { icon: Icon, items }]) => (
              <div key={category} className="border border-gray-200 rounded-lg overflow-hidden mb-2">
                <button onClick={() => toggleCategory(category)} className="w-full px-4 py-2.5 bg-gray-50 flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2"><Icon size={16} className="text-orange-500" />{category}</span>
                  {expandedCategories[category] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expandedCategories[category] && (
                  <div className="p-3 flex flex-wrap gap-2">
                    {items.map(name => (
                      <button key={name} onClick={() => toggleIngredient(name)}
                        className={clsx('px-3 py-1.5 rounded-full text-sm font-medium border transition-all',
                        selectedIngredients.includes(name) ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white text-gray-600 hover:border-orange-400')}>
                        {name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <input className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200"
            placeholder="Add custom ingredient + Enter" value={customInput} onChange={e => setCustomInput(e.target.value)} onKeyDown={handleCustomInput} />

          <div className="flex flex-wrap gap-2">
            {customChips.map(name => (
              <span key={name} className="px-3 py-1.5 rounded-full bg-orange-500 text-white text-sm flex items-center gap-1">
                {name} <button onClick={() => setSelectedIngredients(prev => prev.filter(i => i !== name))}>×</button>
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <select value={diet} onChange={e => setDiet(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
              {['none', 'veg', 'vegan', 'keto', 'paleo'].map(d => <option key={d} value={d}>{d.toUpperCase()}</option>)}
            </select>
            <input type="number" className="border rounded-lg px-3 py-2 w-28 text-sm" value={maxTime} onChange={e => setMaxTime(e.target.value)} placeholder="Max min" />
          </div>

          <div className="flex items-center gap-3">
            <button disabled={!canSubmit} onClick={fetchSmartRecipe}
              className={clsx('px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition',
              canSubmit ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-100 text-gray-400 cursor-not-allowed')}>
              {loading ? "Generating..." : "Find My Recipe"}
            </button>
            <button onClick={() => { setSelectedIngredients([]); setRecipe(null); }} className="px-5 py-2.5 bg-gray-100 rounded-lg text-sm font-medium">Reset</button>
          </div>

          {/* Usage Stats */}
          {hasGeneratedRecipe && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>{dailyUsage} of {MAX_DAILY_RECIPES} free recipes used</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-full rounded-full transition-all" style={{ width: `${(dailyUsage/MAX_DAILY_RECIPES)*100}%` }} />
              </div>
              {dailyUsage >= MAX_DAILY_RECIPES && <p className="text-xs text-red-600 font-bold">Daily limit reached!</p>}
            </div>
          )}
        </div>

        {/* Recipe Display */}
        <div ref={recipeRef}>
          {recipe && (
            <div className="bg-white border border-orange-100 rounded-xl p-6 space-y-4 shadow-md">
              <h2 className="text-xl font-bold text-gray-800">{recipe.title}</h2>
              <div className="flex gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1"><Timer size={16}/> {recipe.estimatedTime}m</span>
                {recipe.servings && <span className="flex items-center gap-1"><Users size={16}/> {recipe.servings} serving</span>}
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold mb-2 flex items-center gap-2"><ShoppingCart size={18}/> Ingredients</h3>
                  <ul className="text-sm space-y-1">
                    {recipe.usedIngredients.map((ing, i) => <li key={i}>• {ing}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold mb-2 flex items-center gap-2"><ChefHat size={18}/> Instructions</h3>
                  <ol className="text-sm space-y-2">
                    {recipe.cookingSteps.map((step, i) => <li key={i}>{i+1}. {step}</li>)}
                  </ol>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button onClick={saveRecipe} className="flex-1 bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600 transition">Save Recipe</button>
                <button onClick={() => window.print()} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">Print</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
}