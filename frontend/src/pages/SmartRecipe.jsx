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
  "Grains & Bread": {
    icon: Wheat,
    items: [
      "chawal",
      "aata",
      "bread",
      "poha",
      "oats",
      "maggi",
      "suji",
      "roti"
    ]
  },
  "Vegetables": {
    icon: Carrot,
    items: [
      "onion",
      "tomato",
      "potato",
      "green chili",
      "garlic",
      "ginger"
    ]
  },
  "Dairy & Eggs": {
    icon: Milk,
    items: [
      "egg",
      "milk",
      "curd",
      "paneer",
      "butter",
      "ghee"
    ]
  },
  "Spices": {
    icon: Flame,
    items: [
      "salt",
      "turmeric",
      "jeera",
      "garam masala",
      "red chili powder"
    ]
  },
  "Protein & Dal": {
    icon: Drumstick,
    items: [
      "dal",
      "besan",
      "chicken"
    ]
  },
  "Extras": {
    icon: Soup,
    items: [
      "oil",
      "ketchup",
      "peanut butter",
      "lemon",
      "maggi masala"
    ]
  }
};

// Flatten for custom chip detection
const PREDEFINED_INGREDIENTS = Object.values(CATEGORIZED_INGREDIENTS).flatMap(cat => cat.items);

export default function SmartRecipe() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [customInput, setCustomInput] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [diet, setDiet] = useState('none');
  const [maxTime, setMaxTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const recipeRef = useRef(null);
  const ingredients = selectedIngredients;

  // Accordion state - all categories expanded by default
  const [expandedCategories, setExpandedCategories] = useState(
    Object.keys(CATEGORIZED_INGREDIENTS).reduce((acc, category) => {
      acc[category] = true;
      return acc;
    }, {})
  );

  // Daily usage tracking
  const [dailyUsage, setDailyUsage] = useState(0);
  const [hasGeneratedRecipe, setHasGeneratedRecipe] = useState(false);
  const MAX_DAILY_RECIPES = 3;

  // Initialize daily usage from localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem('chefmate_usage_date');
    const storedUsage = parseInt(localStorage.getItem('chefmate_daily_usage') || '0', 10);

    if (storedDate === today) {
      setDailyUsage(storedUsage);
      setHasGeneratedRecipe(storedUsage > 0);
    } else {
      // Reset usage for new day
      localStorage.setItem('chefmate_usage_date', today);
      localStorage.setItem('chefmate_daily_usage', '0');
      setDailyUsage(0);
      setHasGeneratedRecipe(false);
    }
  }, []);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const canSubmit = useMemo(
    () => selectedIngredients.length > 0 && !loading && dailyUsage < MAX_DAILY_RECIPES,
    [selectedIngredients, loading, dailyUsage]
  );

  function toArray(value) {
    if (Array.isArray(value))
      return value.filter(Boolean).map((x) => String(x).trim()).filter(Boolean);
    if (typeof value === 'string')
      return value.split(/\n|,|;|\d+\.\s+/).map((x) => x.trim()).filter(Boolean);
    return [];
  }

  function normalizeRecipePayload(data) {
    if (!data || typeof data !== 'object') return null;
    const src = data.recipe && typeof data.recipe === 'object' ? data.recipe : data;
    return {
      ...src,
      title: String(src.title || 'Untitled Recipe'),
      estimatedTime: Number(src.estimatedTime) || 0,
      servings: src.servings ? Number(src.servings) || src.servings : undefined,
      usedIngredients: toArray(src.usedIngredients),
      optionalIngredients: toArray(src.optionalIngredients),
      healthBenefits: toArray(src.healthBenefits),
      cookingSteps: toArray(src.cookingSteps),
    };
  }

  function toggleIngredient(name) {
    setSelectedIngredients((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  }

  function handleCustomInput(e) {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const raw = customInput.trim().toLowerCase();
    if (!raw) return;
    const parts = raw.split(',').map((s) => s.trim()).filter(Boolean);
    setSelectedIngredients((prev) => {
      const next = [...new Set([...prev, ...parts])].slice(0, 20);
      const added = next.length - prev.length;
      if (added > 0) toast.success(`Added ${added} ingredient${added > 1 ? 's' : ''}!`, { duration: 2000 });
      else toast('Already added!', { duration: 2000 });
      if (next.length >= 20) toast('Max 20 ingredients reached!', { duration: 3000 });
      return next;
    });
    setCustomInput('');
  }

  function removeCustomIngredient(name) {
    setSelectedIngredients((prev) => prev.filter((i) => i !== name));
    toast.success(`Removed "${name}"`, { duration: 1500 });
  }

  async function fetchSmartRecipe() {
    setLoading(true); setError(''); setRecipe(null);
    toast.loading('AI Chef is analyzing your ingredients...', { id: 'recipe-loading', duration: 4000 });
    try {
      const res = await fetch(
        `${import.meta.env?.VITE_BASE_URL || 'http://localhost:5000'}/api/smart-recipe`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ingredients, prefs: { diet, ...(maxTime ? { maxTime: Number(maxTime) } : {}) } }) }
      );
      let data;
      try { data = await res.json(); } catch { throw new Error('Server returned invalid JSON'); }
      
      // Handle rate limiting
      if (res.status === 429) {
        throw new Error('Too many requests. Please wait a bit and try again.');
      }
      
      if (!res.ok) throw new Error(data.error || 'Failed');
      const normalized = normalizeRecipePayload(data);
      if (!normalized) throw new Error('Recipe payload is invalid');
      setRecipe(normalized);
      
      // Update daily usage
      const newUsage = dailyUsage + 1;
      setDailyUsage(newUsage);
      setHasGeneratedRecipe(true);
      localStorage.setItem('chefmate_daily_usage', String(newUsage));
      
      toast.dismiss('recipe-loading');
      toast.success('Perfect recipe created!', { duration: 3000 });
      setTimeout(() => { recipeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 200);
    } catch (e) {
      toast.dismiss('recipe-loading');
      setError(e.message || 'Something went wrong');
      toast.error(`Oops! ${e.message || 'Something went wrong'}`, { duration: 4000 });
    } finally { setLoading(false); }
  }

  async function saveRecipe() {
    if (!recipe) return;
    setSaving(true);
    toast.loading('Saving your recipe...', { id: 'recipe-saving' });
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please login first to save recipes');
      
      // Check if recipe already exists
      const checkRes = await authenticatedFetch('/api/recipes/saved', {}, () => {
        logout();
        navigate('/login');
      });
      
      const checkData = await checkRes.json();
      
      if (checkRes.ok && checkData.savedRecipes) {
        const alreadyExists = checkData.savedRecipes.some(
          r => r.title.toLowerCase() === recipe.title.toLowerCase()
        );
        
        if (alreadyExists) {
          toast.dismiss('recipe-saving');
          toast.error('Recipe already saved!', { duration: 3000 });
          setSaving(false);
          return;
        }
      }
      
      const res = await authenticatedFetch('/api/recipes/save', {
        method: 'POST',
        body: JSON.stringify(recipe)
      }, () => {
        logout();
        navigate('/login');
      });
      
      let data;
      try { data = await res.json(); } catch { throw new Error('Server returned invalid JSON'); }
      if (!res.ok) throw new Error(data.error || 'Failed to save recipe');
      toast.dismiss('recipe-saving');
      toast.success('Saved! You can cook this anytime', { duration: 3000 });
    } catch (err) {
      toast.dismiss('recipe-saving');
      if (err.message === 'Session expired. Please login again.') {
        toast.error('Session expired. Please login again.', { duration: 4000 });
        setTimeout(() => navigate('/login'), 1500);
      } else {
        toast.error(`Failed to save recipe: ${err.message}`, { duration: 4000 });
      }
    } finally { setSaving(false); }
  }

  async function shareRecipe() {
    if (!recipe) return;
    
    toast.loading('Creating shareable link...', { id: 'share-loading' });
    
    try {
      // Create shareable recipe
      const res = await apiFetch('/api/share-recipe', {
        method: 'POST',
        body: JSON.stringify(recipe)
      });
      
      if (!res.ok) {
        throw new Error('Failed to create shareable link');
      }
      
      const data = await res.json();
      const shareUrl = `${window.location.origin}/recipe/share/${data.shareId}`;
      const shareText = `I just made ${recipe.title} 🍳\n\nCheck the full recipe here: ${shareUrl}`;
      
      toast.dismiss('share-loading');
      
      // Use Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: recipe.title,
          text: shareText,
          url: shareUrl
        });
        toast.success('Recipe shared!', { duration: 2000 });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!', { duration: 3000 });
      }
    } catch (err) {
      toast.dismiss('share-loading');
      if (err.name !== 'AbortError') {
        toast.error('Failed to share recipe', { duration: 3000 });
      }
    }
  }

  async function shareOnWhatsApp() {
    if (!recipe) return;
    
    toast.loading('Creating shareable link...', { id: 'whatsapp-loading' });
    
    try {
      // Create shareable recipe
      const res = await apiFetch('/api/share-recipe', {
        method: 'POST',
        body: JSON.stringify(recipe)
      });
      
      if (!res.ok) {
        throw new Error('Failed to create shareable link');
      }
      
      const data = await res.json();
      const shareUrl = `${window.location.origin}/recipe/share/${data.shareId}`;
      const shareText = `I just made ${recipe.title} 🍳\n\nCheck the full recipe here: ${shareUrl}`;
      
      toast.dismiss('whatsapp-loading');
      
      // Open WhatsApp with the shareable link
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(whatsappUrl, '_blank');
      toast.success('Opening WhatsApp...', { duration: 2000 });
    } catch (err) {
      toast.dismiss('whatsapp-loading');
      toast.error('Failed to create share link', { duration: 3000 });
    }
  }

  const customChips = selectedIngredients.filter((i) => !PREDEFINED_INGREDIENTS.includes(i));

  return (
    <div className="min-h-screen pb-20 pt-28 px-4" style={{ backgroundColor: '#FDF6EE' }}>
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center mb-2">
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center justify-center gap-2 mb-2">
            <ChefHat size={24} className="text-orange-500" /> Smart Recipe
          </h1>
          <p className="text-sm text-gray-600">Pick your ingredients and get an AI-generated recipe.</p>
        </div>

        {/* Input card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5 shadow-sm hover:shadow-md transition duration-200">

          {/* Categorized ingredient chips */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Leaf size={16} className="text-green-600" /> Pick Your Ingredients
            </label>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {Object.entries(CATEGORIZED_INGREDIENTS).map(([category, { icon: Icon, items }]) => (
                <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Category header - accordion toggle */}
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full px-4 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-left"
                  >
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Icon size={16} className="text-orange-500" />
                      {category}
                    </span>
                    {expandedCategories[category] ? (
                      <ChevronUp size={16} className="text-gray-500" />
                    ) : (
                      <ChevronDown size={16} className="text-gray-500" />
                    )}
                  </button>
                  
                  {/* Category ingredients */}
                  {expandedCategories[category] && (
                    <div className="p-3 bg-white flex flex-wrap gap-2">
                      {items.map((name) => {
                        const selected = selectedIngredients.includes(name);
                        return (
                          <button
                            key={name}
                            onClick={() => toggleIngredient(name)}
                            className={clsx(
                              'px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 select-none',
                              selected
                                ? 'bg-orange-500 border-orange-500 text-white'
                                : 'bg-white border-gray-200 text-gray-600 hover:border-orange-400'
                            )}
                          >
                            <span className="flex items-center gap-1">
                              {selected && <Check size={12} />}
                              {name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Custom ingredient input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add a custom ingredient — press <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-xs font-mono">Enter</kbd>
            </label>
            <input
              className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all bg-white text-gray-700 placeholder-gray-400 text-sm"
              placeholder="e.g. avocado, coconut milk…"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={handleCustomInput}
            />
          </div>

          {/* Custom chips */}
          {customChips.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {customChips.map((name) => (
                <span key={name} className="px-3 py-1.5 rounded-full bg-orange-500 text-white text-sm font-medium flex items-center gap-1">
                  {name}
                  <button onClick={() => removeCustomIngredient(name)} className="ml-1 hover:text-orange-200 transition-colors" aria-label={`Remove ${name}`}>×</button>
                </span>
              ))}
            </div>
          )}

          {/* Selection count */}
          <p className="text-sm text-gray-600">
            {selectedIngredients.length} ingredient{selectedIngredients.length !== 1 ? 's' : ''} selected
          </p>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1"><Salad size={16} className="text-green-600" /> Diet</label>
              <select value={diet} onChange={(e) => setDiet(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all">
                <option value="none">None</option>
                <option value="veg">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="keto">Keto</option>
                <option value="paleo">Paleo</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1"><Timer size={16} className="text-orange-500" /> Max time (min)</label>
              <input type="number" min="5" max="240"
                className="border border-gray-200 rounded-lg px-3 py-2 w-28 bg-white text-gray-700 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all"
                value={maxTime} onChange={(e) => setMaxTime(e.target.value)} placeholder="e.g. 30" />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button disabled={!canSubmit} onClick={fetchSmartRecipe}
              className={clsx('px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition duration-200',
                canSubmit ? 'bg-orange-500 text-white hover:bg-orange-600 hover:scale-[1.02]' : 'bg-gray-100 text-gray-400 cursor-not-allowed')}>
              {loading ? (<><span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Generating...</>)
                : (<><Search size={16} /> Find My Recipe</>)}
            </button>
            <button onClick={() => { setSelectedIngredients([]); setRecipe(null); toast.success('Cleared!', { duration: 2000 }); }}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition duration-200 flex items-center gap-2">
              <RotateCcw size={16} /> Reset
            </button>
          </div>

          {/* Daily usage indicator */}
          {hasGeneratedRecipe && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Timer size={16} className="text-orange-600" />
                  {dailyUsage} of {MAX_DAILY_RECIPES} free recipes used today
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full transition-all duration-500 ease-out rounded-full"
                  style={{
                    width: `${(dailyUsage / MAX_DAILY_RECIPES) * 100}%`,
                    backgroundColor: '#E8521A'
                  }}
                />
              </div>
              
              {dailyUsage >= MAX_DAILY_RECIPES && (
                <p className="text-sm text-orange-700 font-medium flex items-center gap-2">
                  <XCircle size={16} />
                  Daily limit reached. Come back tomorrow!
                </p>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm flex items-center gap-2"><XCircle size={16} /> {error}</p>
            </div>
          )}
        </div>

        {/* Output */}
        <div ref={recipeRef}>
          {loading && !recipe && (
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-6 text-center shadow-sm">
              <div className="inline-block animate-spin rounded-full h-7 w-7 border-4 border-orange-200 border-t-orange-500 mb-3" />
              <p className="text-sm text-orange-600 font-medium flex items-center justify-center gap-2">
                <ChefHat size={16} className="text-orange-500" /> Cooking something for you...
              </p>
            </div>
          )}

          {recipe && !loading && (
            <div className="bg-white border border-orange-100 rounded-xl p-5 space-y-5 shadow-md hover:shadow-lg transition duration-200">
              {/* Title row */}
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Utensils size={20} className="text-orange-500 flex-shrink-0" />{recipe.title}
                </h2>
                <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-lg flex-shrink-0">
                  <Timer size={14} className="text-orange-600" />
                  <span className="text-orange-700 font-medium text-sm">{recipe.estimatedTime} min</span>
                </div>
              </div>

              {/* Health benefits */}
              {recipe.healthBenefits?.length > 0 && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm flex items-start gap-2">
                    <Heart size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Why it's healthy:</strong> {recipe.healthBenefits.join(', ')}</span>
                  </p>
                </div>
              )}

              <div className="grid lg:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <ShoppingCart size={18} className="text-orange-500" /> Used Ingredients
                    </h3>
                    <ul className="space-y-1.5">
                      {recipe.usedIngredients?.map((x, i) => (
                        <li key={x + i} className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 bg-orange-400 rounded-full flex-shrink-0" />{x}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {recipe.optionalIngredients?.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <Package size={18} className="text-orange-500" /> Optional / Pantry
                      </h3>
                      <ul className="space-y-1.5">
                        {recipe.optionalIngredients.map((x, i) => (
                          <li key={x + i} className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full flex-shrink-0" />{x}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <ChefHat size={18} className="text-orange-500" /> Cooking Steps
                  </h3>
                  <ol className="space-y-3">
                    {recipe.cookingSteps?.map((s, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center font-medium text-xs">{i + 1}</span>
                        <span className="text-sm text-gray-600 leading-relaxed">{s}</span>
                      </li>
                    ))}
                  </ol>
                  <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5">
                    {recipe.servings && (
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Users size={16} className="text-orange-500" /> <strong>Servings:</strong> {recipe.servings}
                      </p>
                    )}
                    {recipe.notes && !recipe.notes.toLowerCase().includes('fallback') && (
                      <p className="text-sm text-gray-600 flex items-start gap-2">
                        <FileText size={16} className="text-gray-400 mt-0.5 flex-shrink-0" /><span>{recipe.notes}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button onClick={() => navigate('/cook', { state: { recipe } })}
                  className="px-5 py-2.5 bg-orange-500 text-white rounded-lg font-medium text-sm hover:bg-orange-600 transition duration-200 hover:scale-[1.02] flex items-center justify-center gap-2">
                  <ChefHat size={18} /> Start Cooking
                </button>
                <button onClick={shareRecipe}
                  className="px-5 py-2.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition duration-200 flex items-center justify-center gap-2">
                  <Share2 size={18} /> Share Recipe
                </button>
                <button onClick={shareOnWhatsApp}
                  className="px-5 py-2.5 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition duration-200 flex items-center justify-center gap-2">
                  <Share2 size={18} /> WhatsApp
                </button>
                <button onClick={saveRecipe} disabled={saving}
                  className={clsx('px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition duration-200 flex items-center justify-center gap-2', saving && 'opacity-50 cursor-not-allowed')}>
                  {saving ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600" /> Saving…</>)
                    : (<><Bookmark size={18} /> Save Recipe</>)}
                </button>
              </div>
              <p className="text-xs text-gray-400">Access saved recipes anytime from your profile.</p>

              {/* What next */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-3">What do you want to do next?</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button onClick={() => navigate('/recipes')}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition duration-200 hover:scale-[1.01]">
                    <Utensils size={16} /> Explore More Recipes
                  </button>
                  <button onClick={() => navigate('/meal-planner')}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition duration-200 hover:scale-[1.01]">
                    <Salad size={16} /> Plan My Meals
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Toaster position="top-right" gutter={8} toastOptions={{
        duration: 3000,
        style: { background: '#fff', color: '#374151', fontWeight: '500', fontSize: '14px', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)', maxWidth: '380px' },
        success: { iconTheme: { primary: '#f97316', secondary: '#ffffff' } },
        error: { iconTheme: { primary: '#ef4444', secondary: '#ffffff' } },
      }} />
    </div>
  );
}
