import { useMemo, useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import toast, { Toaster } from 'react-hot-toast';
import {
  ChefHat, Search, RotateCcw, Salad, Timer, Share2, Bookmark,
  Utensils, Leaf, ShoppingCart, Package, Users,
  Heart, XCircle, Check, ChevronDown, ChevronUp, Wheat, Carrot,
  Milk, Flame, Drumstick, Soup, Bell, Sparkles
} from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import { authenticatedFetch, apiFetch } from '../utils/apiClient';
import { usePushNotification } from '../hooks/usePushNotification';

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
      "roti",
      "vermicelli",
      "maida",
      "cornflour"
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
      "ginger",
      "capsicum",
      "carrot",
      "spinach",
      "corn",
      "peas",
      "mushroom",
      "brinjal",
      "cabbage"
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
      "ghee",
      "cheese",
      "cream"
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
      "chicken",
      "rajma",
      "chana",
      "tofu",
      "soya chunks",
      "fish",
      "mutton"
    ]
  },
  "Extras": {
    icon: Soup,
    items: [
      "oil",
      "ketchup",
      "peanut butter",
      "lemon",
      "maggi masala",
      "soy sauce",
      "vinegar",
      "mayonnaise",
      "chaat masala",
      "hing"
    ]
  },
  "Fruits & Fresh": {
    icon: Leaf,
    items: [
      "banana",
      "apple",
      "coconut",
      "lemon juice"
    ]
  }
};

const PREDEFINED_INGREDIENTS = Object.values(CATEGORIZED_INGREDIENTS).flatMap(cat => cat.items);
const PREDEFINED_INGREDIENT_SET = new Set(PREDEFINED_INGREDIENTS.map((x) => x.toLowerCase()));
const INGREDIENT_ALIASES = {
  'shimla mirch': 'capsicum',
  'dhania': 'coriander',
  'coriander leaves': 'coriander',
  'hari mirch': 'green chili',
  'mirchi': 'green chili',
  'lal mirch powder': 'red chili powder',
  'aloo': 'potato',
  'pyaz': 'onion',
  'dahi': 'curd',
  'atta': 'aata',
  'rava': 'suji',
  'baingan': 'brinjal',
  'adrak': 'ginger',
  'lahsun': 'garlic',
};

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
  const ingredientValidationCache = useRef(new Map());
  const ingredients = selectedIngredients;
  
  // Feedback state
  const [feedbackState, setFeedbackState] = useState({
    selected: null, // 'helpful' | 'not_helpful' | null
    submitted: false
  });

  const [expandedCategories, setExpandedCategories] = useState(
    Object.keys(CATEGORIZED_INGREDIENTS).reduce((acc, category) => {
      acc[category] = true;
      return acc;
    }, {})
  );

  // Daily usage tracking - different limits for authenticated vs guest users
  const [dailyUsage, setDailyUsage] = useState(0);
  const [hasGeneratedRecipe, setHasGeneratedRecipe] = useState(false);
  const MAX_DAILY_RECIPES = user ? 15 : 3;

  // Push notification state
  const { subscribe, isSubscribed, isLoading } = usePushNotification();
  const [promptDismissed, setPromptDismissed] = useState(
    localStorage.getItem('push_dismissed') === 'true'
  );

  // Temporary: reset for testing — remove after confirming it works
  // localStorage.removeItem('push_dismissed');

  const handleSubscribe = async () => {
    // First explicitly request permission
    const permission = await Notification.requestPermission();
    console.log('[push] permission result:', permission);
    
    if (permission !== 'granted') {
      console.log('[push] permission denied or dismissed')
      return
    }
    
    const success = await subscribe();
    if (success) {
      localStorage.setItem('push_dismissed', 'true');
      setPromptDismissed(true);
      toast.success('🔔 You\'re all set! We\'ll remind you at 7pm daily', { duration: 4000 });
    } else {
      toast.error('Failed to enable notifications. Please try again.', { duration: 3000 });
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('push_dismissed', 'true');
    setPromptDismissed(true);
  };

  useEffect(() => {
    // Determine specific keys based on authentication status
    const userId = user?.id || user?._id || 'guest';

    const today = new Date().toDateString();
    
    // Use user-specific keys if authenticated, otherwise use guest keys
    const dateKey = user ? `chefmate_usage_date_${user.id}` : 'chefmate_usage_date';
    const usageKey = user ? `chefmate_usage_${user.id}` : 'chefmate_daily_usage';
    
    const storedDate = localStorage.getItem(dateKey);
    const storedUsage = parseInt(localStorage.getItem(usageKey) || '0', 10);

    if (storedDate === today) {
      setDailyUsage(storedUsage);
      setHasGeneratedRecipe(storedUsage > 0);
    } else {
      // Reset usage for new day
      localStorage.setItem(dateKey, today);
      localStorage.setItem(usageKey, '0');
      setDailyUsage(0);
      setHasGeneratedRecipe(false);
    }
  }, [user]);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const canSubmit = useMemo(
    () => selectedIngredients.length > 0 && !loading && dailyUsage < MAX_DAILY_RECIPES,
    [selectedIngredients, loading, dailyUsage, MAX_DAILY_RECIPES]
  );

  function toArray(value) {
    if (Array.isArray(value))
      return value.filter(Boolean).map((x) => String(x).trim()).filter(Boolean);
    if (typeof value === 'string')
      return value.split(/\n|,|;|\d+\.\s+/).map((x) => x.trim()).filter(Boolean);
    return [];
  }

  function normalizeCookingSteps(value) {
    const rawSteps = Array.isArray(value)
      ? value
      : typeof value === 'string'
        ? value.split(/\n+/)
        : [];

    const cleaned = rawSteps
      .map((x) => String(x).trim())
      .filter(Boolean)
      .map((step) => step.replace(/^\d+[\).\-\s:]+/, '').trim())
      .filter((step) => step && !/^\d+$/.test(step));

    return cleaned;
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
      cookingSteps: normalizeCookingSteps(src.cookingSteps),
    };
  }

  function toggleIngredient(name) {
    setSelectedIngredients((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  }

  function normalizeIngredientName(value) {
    return String(value || '').toLowerCase().trim().replace(/\s+/g, ' ');
  }

  function localValidateIngredient(value) {
    const normalized = normalizeIngredientName(value);
    if (!normalized) return { verdict: 'invalid_non_food', reason: 'Ingredient is empty.' };
    if (normalized.length < 2 || normalized.length > 30) {
      return { verdict: 'invalid_non_food', reason: 'Ingredient must be 2-30 characters.' };
    }
    if (/^\d+$/.test(normalized) || !/[a-z]/.test(normalized) || /^[^a-z]+$/i.test(normalized)) {
      return { verdict: 'invalid_non_food', reason: 'Please enter a real food ingredient.' };
    }

    const canonical = INGREDIENT_ALIASES[normalized] || normalized;
    if (PREDEFINED_INGREDIENT_SET.has(canonical)) {
      return { verdict: 'valid_ingredient', canonical, reason: 'Matched known ingredient.' };
    }

    return { verdict: 'unknown', canonical };
  }

  async function validateIngredientHybrid(value) {
    const local = localValidateIngredient(value);
    if (local.verdict !== 'unknown') return local;

    const cacheKey = local.canonical;
    if (ingredientValidationCache.current.has(cacheKey)) {
      return ingredientValidationCache.current.get(cacheKey);
    }

    const API_BASE = import.meta.env?.VITE_BASE_URL || 'http://localhost:5000';
    try {
      const res = await fetch(`${API_BASE}/api/ingredients/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredient: cacheKey }),
      });
      const data = await res.json().catch(() => ({}));
      const result = {
        verdict: data.verdict || 'possibly_valid',
        canonical: normalizeIngredientName(data.canonical || cacheKey),
        reason: data.reason || 'Checked with fallback validation.',
      };
      ingredientValidationCache.current.set(cacheKey, result);
      return result;
    } catch {
      return { verdict: 'possibly_valid', canonical: cacheKey, reason: 'Could not verify now, added with caution.' };
    }
  }

  async function handleCustomInput(e) {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const raw = customInput.trim();
    if (!raw) return;
    
    // Clear input immediately to prevent confusion
    setCustomInput('');
    
    const parts = raw.split(',').map((s) => s.trim()).filter(Boolean);
    const verdicts = await Promise.all(parts.map((part) => validateIngredientHybrid(part)));

    const approved = [];
    let rejectedCount = 0;
    let warningCount = 0;

    verdicts.forEach((result, index) => {
      if (result.verdict === 'invalid_non_food') {
        rejectedCount += 1;
        console.log(`[ingredient] rejected: "${parts[index]}" - ${result.reason}`);
        return;
      }
      if (result.verdict === 'possibly_valid') warningCount += 1;
      approved.push(result.canonical);
      console.log(`[ingredient] approved: "${parts[index]}" → "${result.canonical}"`);
    });

    if (rejectedCount > 0) {
      toast.error(`Rejected ${rejectedCount} invalid ingredient${rejectedCount > 1 ? 's' : ''}.`, { duration: 2500 });
    }

    if (warningCount > 0) {
      toast(`Added ${warningCount} item${warningCount > 1 ? 's' : ''} as possibly valid.`, { duration: 2500 });
    }

    setSelectedIngredients((prev) => {
      const next = [...new Set([...prev, ...approved])].slice(0, 20);
      const added = next.length - prev.length;
      if (added > 0) toast.success(`Added ${added} ingredient${added > 1 ? 's' : ''}!`, { duration: 2000 });
      else if (approved.length > 0) toast('Already added!', { duration: 2000 });
      if (next.length >= 20) toast('Max 20 ingredients reached!', { duration: 3000 });
      return next;
    });
  }

  function removeIngredient(name) {
    setSelectedIngredients((prev) => prev.filter((i) => i !== name));
    toast.success(`Removed "${name}"`, { duration: 1500 });
  }

  const handleFeedback = async (rating) => {
    if (feedbackState.submitted || feedbackState.selected || !recipe) return;

    // Immediately update UI
    setFeedbackState({ selected: rating, submitted: true });

    // Send feedback to backend (fire and forget)
    try {
      await fetch(`${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}/api/feedback/recipe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipeName: recipe.title,
          ingredients: recipe.usedIngredients || selectedIngredients,
          rating,
          timestamp: new Date()
        })
      });
    } catch (err) {
      // Silently fail - user already sees success message
      console.error("Failed to submit feedback:", err);
    }
  };

  async function fetchSmartRecipe() {
    setLoading(true); setError(''); setRecipe(null);
    // Reset feedback when generating new recipe
    setFeedbackState({ selected: null, submitted: false });
    toast.loading('AI Chef is analyzing your ingredients...', { id: 'recipe-loading', duration: 4000 });
    try {
      const token = localStorage.getItem('token');
      const API_BASE = import.meta.env?.VITE_BASE_URL || 'http://localhost:5000';

      const res = await fetch(`${API_BASE}/api/smart-recipe`,
        { method: 'POST', headers: { 'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
          body: JSON.stringify({ ingredients, prefs: { diet, ...(maxTime ? { maxTime: Number(maxTime) } : {}) } }) }
      );
      let data;
      try { data = await res.json(); } catch { throw new Error('Server returned invalid JSON'); }
      
      if (res.status === 429) throw new Error('Too many requests. Please wait a bit and try again.');
      if (!res.ok) throw new Error(data.error || 'Failed');

      const normalized = normalizeRecipePayload(data);
      if (!normalized) throw new Error('Recipe payload is invalid');
      setRecipe(normalized);
      
      // Update usage logic with user-specific keys
      const userId = user?.id || user?._id || 'guest';
      // Update daily usage with user-specific keys
      const newUsage = dailyUsage + 1;

      setDailyUsage(newUsage);
      setHasGeneratedRecipe(true);
      
      const usageKey = user ? `chefmate_usage_${user.id}` : 'chefmate_daily_usage';
      localStorage.setItem(usageKey, String(newUsage));
      
      toast.dismiss('recipe-loading');
      toast.success('Perfect recipe created!', { duration: 3000 });
      setTimeout(() => { recipeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 200);
    } catch (e) {
      toast.dismiss('recipe-loading');
      setError(e.message || 'Something went wrong');
      toast.error(`Oops! ${e.message || 'Something went wrong'}`, { duration: 4000 });
    } finally { setLoading(false); }
  }

  // Save/Share functions remained unchanged
  async function saveRecipe() {
    if (!recipe) return;
    setSaving(true);
    toast.loading('Saving your recipe...', { id: 'recipe-saving' });
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please login first to save recipes');
      
      const res = await authenticatedFetch('/api/recipes/save', {
        method: 'POST',
        body: JSON.stringify(recipe)
      }, () => { logout(); navigate('/login'); });
      
      let data;
      try { data = await res.json(); } catch { throw new Error('Server returned invalid JSON'); }
      if (!res.ok) throw new Error(data.error || 'Failed to save recipe');
      toast.dismiss('recipe-saving');
      toast.success('Saved! You can cook this anytime', { duration: 3000 });
    } catch (err) {
      toast.dismiss('recipe-saving');
      toast.error(`Failed to save recipe: ${err.message}`, { duration: 4000 });
    } finally { setSaving(false); }
  }

  async function shareRecipe() {
    if (!recipe) return;
    toast.loading('Creating shareable link...', { id: 'share-loading' });
    try {
      const res = await apiFetch('/api/share-recipe', { method: 'POST', body: JSON.stringify(recipe) });
      if (!res.ok) throw new Error('Failed to create shareable link');
      const data = await res.json();
      const shareUrl = `${window.location.origin}/recipe/share/${data.shareId}`;
      const shareText = `I just made ${recipe.title} 🍳\n\nCheck the full recipe here: ${shareUrl}`;
      toast.dismiss('share-loading');
      if (navigator.share) {
        await navigator.share({ title: recipe.title, text: shareText, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!', { duration: 3000 });
      }
    } catch (err) {
      toast.dismiss('share-loading');
      if (err.name !== 'AbortError') toast.error('Failed to share recipe', { duration: 3000 });
    }
  }

  async function shareOnWhatsApp() {
    if (!recipe) return;
    toast.loading('Creating shareable link...', { id: 'whatsapp-loading' });
    try {
      const res = await apiFetch('/api/share-recipe', { method: 'POST', body: JSON.stringify(recipe) });
      if (!res.ok) throw new Error('Failed to create shareable link');
      const data = await res.json();
      const shareUrl = `${window.location.origin}/recipe/share/${data.shareId}`;
      const shareText = `I just made ${recipe.title} 🍳\n\nCheck the full recipe here: ${shareUrl}`;
      toast.dismiss('whatsapp-loading');
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
    } catch (err) {
      toast.dismiss('whatsapp-loading');
      toast.error('Failed to create share link', { duration: 3000 });
    }
  }

  const customChips = selectedIngredients.filter((i) => !PREDEFINED_INGREDIENTS.includes(i));

  return (
    <div className="min-h-screen pb-12 sm:pb-20 pt-20 sm:pt-24 px-3 sm:px-4 lg:px-6 bg-gradient-to-br from-orange-50 via-white to-blue-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-gradient-to-br from-orange-200/40 to-pink-200/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-gradient-to-br from-orange-100/20 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto space-y-6 sm:space-y-8">

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-6 sm:mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/80 backdrop-blur-sm border border-orange-200/50 rounded-full shadow-sm mb-4 sm:mb-6"
          >
            <Sparkles size={14} className="text-orange-500 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-semibold text-gray-700">AI-Powered Recipe Generator</span>
          </motion.div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight px-4">
            <span className="bg-gradient-to-r from-gray-900 to-gray-800 bg-clip-text text-transparent">
              What's in Your
            </span>
            {' '}
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Kitchen?
            </span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
            Select your ingredients and let AI create a personalized recipe just for you. No fancy ingredients needed.
          </p>
        </motion.div>

        {/* Input card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 space-y-6 sm:space-y-8 shadow-xl hover:shadow-2xl transition-all duration-500"
        >

          {/* Custom ingredient input */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                <Sparkles size={14} className="text-orange-600 sm:w-4 sm:h-4" strokeWidth={2.5} />
              </div>
              <span className="flex-1">Add custom ingredient</span>
              <span className="hidden sm:inline text-gray-500 font-normal text-xs">- press <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-lg text-xs font-mono shadow-sm">Enter</kbd></span>
            </label>
            <input
              className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-200 shadow-sm hover:border-gray-300"
              placeholder="e.g. avocado, coconut milk..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={handleCustomInput}
            />
            <p className="sm:hidden text-xs text-gray-500 mt-1.5">Press Enter to add</p>
          </div>

          {/* Custom chips */}
          <AnimatePresence>
            {customChips.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2.5"
              >
                {customChips.map((name) => (
                  <motion.span 
                    key={name} 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium flex items-center gap-2 shadow-md"
                  >
                    {name}
                    <button 
                      onClick={() => removeIngredient(name)} 
                      className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors duration-200" 
                      aria-label={`Remove ${name}`}
                    >
                      <XCircle size={16} strokeWidth={2.5} />
                    </button>
                  </motion.span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Categorized ingredient chips */}
          <div>
            <label className="block text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-5 flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center shadow-sm">
                <Leaf size={18} className="text-green-600 sm:w-5 sm:h-5" strokeWidth={2.5} />
              </div>
              Pick Your Ingredients
            </label>
            <div className="space-y-3 sm:space-y-4 max-h-[400px] sm:max-h-[500px] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
              {Object.entries(CATEGORIZED_INGREDIENTS).map(([category, { icon: Icon, items }]) => (
                <motion.div 
                  key={category} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-2 border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-all duration-200 flex items-center justify-between text-left group"
                  >
                    <span className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-sm">
                        <Icon size={18} className="text-orange-600 sm:w-5 sm:h-5" strokeWidth={2.5} />
                      </div>
                      {category}
                    </span>
                    <motion.div
                      animate={{ rotate: expandedCategories[category] ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <ChevronDown size={18} className="text-gray-500 sm:w-5 sm:h-5" strokeWidth={2.5} />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {expandedCategories[category] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="p-3 sm:p-5 bg-gradient-to-br from-gray-50 to-white flex flex-wrap gap-2">
                          {items.map((name) => {
                            const selected = selectedIngredients.includes(name);
                            return (
                              <motion.button
                                key={name}
                                onClick={() => toggleIngredient(name)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={clsx(
                                  'px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold border-2 transition-all duration-200 select-none',
                                  selected
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 border-orange-500 text-white shadow-lg shadow-orange-200'
                                    : 'bg-white border-gray-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50 shadow-sm hover:shadow-md'
                                )}
                              >
                                <span className="flex items-center gap-1.5">
                                  {selected && <Check size={14} strokeWidth={3} />}
                                  {name}
                                </span>
                              </motion.button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Selection count */}
          <div className="flex items-center justify-between py-4 px-6 bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-2xl border-2 border-orange-200 shadow-sm">
            <span className="text-base font-bold text-gray-900 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-200 flex items-center justify-center">
                <ShoppingCart size={16} className="text-orange-700" strokeWidth={2.5} />
              </div>
              {selectedIngredients.length} ingredient{selectedIngredients.length !== 1 ? 's' : ''} selected
            </span>
            {selectedIngredients.length > 0 && (
              <span className="text-sm text-orange-700 font-semibold">Max 20</span>
            )}
          </div>

          {selectedIngredients.length > 0 && (
            <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm">
              <p className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package size={18} className="text-gray-600" strokeWidth={2.5} />
                Selected ingredients
              </p>
              <div className="flex flex-wrap gap-2.5">
                {selectedIngredients.map((name) => (
                  <span
                    key={`selected-${name}`}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-100 to-orange-50 border-2 border-orange-200 text-orange-800 text-sm font-semibold flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    {name}
                    <button
                      type="button"
                      onClick={() => removeIngredient(name)}
                      className="hover:bg-orange-200 rounded-full p-1 transition-colors duration-200"
                      aria-label={`Remove ${name}`}
                    >
                      <XCircle size={16} strokeWidth={2.5} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center shadow-sm">
                  <Salad size={16} className="text-green-600" strokeWidth={2.5} />
                </div>
                Diet Preference
              </label>
              <select 
                value={diet} 
                onChange={(e) => setDiet(e.target.value)}
                className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 font-medium focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-200 shadow-sm hover:border-gray-300 cursor-pointer"
              >
                <option value="none">None</option>
                <option value="veg">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="keto">Keto</option>
                <option value="paleo">Paleo</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center shadow-sm">
                  <Timer size={16} className="text-orange-600" strokeWidth={2.5} />
                </div>
                Max Cooking Time
              </label>
              <input 
                type="number" 
                min="5" 
                max="240"
                className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 font-medium focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-200 shadow-sm hover:border-gray-300"
                value={maxTime} 
                onChange={(e) => setMaxTime(e.target.value)} 
                placeholder="30 minutes" 
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-2 sm:pt-4">
            <motion.button 
              disabled={!canSubmit} 
              onClick={fetchSmartRecipe}
              whileHover={canSubmit ? { scale: 1.02 } : {}}
              whileTap={canSubmit ? { scale: 0.98 } : {}}
              className={clsx(
                'w-full sm:flex-1 px-6 sm:px-8 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300 shadow-lg',
                canSubmit 
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-2xl hover:from-orange-600 hover:to-orange-700 shadow-orange-200' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
              )}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 sm:w-6 sm:h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="hidden sm:inline">Generating Recipe...</span>
                  <span className="sm:hidden">Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} className="sm:w-5 sm:h-5" strokeWidth={2.5} /> Find My Recipe
                </>
              )}
            </motion.button>
            <motion.button 
              onClick={() => { setSelectedIngredients([]); setRecipe(null); toast.success('Cleared!', { duration: 2000 }); }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 shadow-sm hover:shadow-lg"
            >
              <RotateCcw size={18} className="sm:w-5 sm:h-5" strokeWidth={2.5} /> Reset
            </motion.button>
          </div>

          {/* Daily usage indicator */}
          <AnimatePresence>
            {hasGeneratedRecipe && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-5 bg-gradient-to-br from-orange-50 to-orange-100/50 border-2 border-orange-200 rounded-2xl space-y-3 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-orange-200 flex items-center justify-center">
                      <Timer size={16} className="text-orange-700" strokeWidth={2.5} />
                    </div>
                    {dailyUsage} of {MAX_DAILY_RECIPES} {user ? 'recipes' : 'free recipes'} used today
                  </span>
                </div>
                
                <div className="w-full bg-orange-200/50 rounded-full h-3 overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(dailyUsage / MAX_DAILY_RECIPES) * 100}%` }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-sm"
                  />
                </div>
                
                {dailyUsage >= MAX_DAILY_RECIPES && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-orange-800 font-medium flex items-center gap-2 bg-white/60 px-3 py-2 rounded-lg"
                  >
                    <XCircle size={16} strokeWidth={2.5} />
                    {user ? 'Daily limit reached. Come back tomorrow!' : 'Free limit reached. Sign in for 15 recipes/day!'}
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl shadow-sm"
              >
                <p className="text-red-700 text-sm font-medium flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-200 flex items-center justify-center flex-shrink-0">
                    <XCircle size={16} className="text-red-700" strokeWidth={2.5} />
                  </div>
                  {error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Output */}
        <div ref={recipeRef}>
          <AnimatePresence mode="wait">
            {loading && !recipe && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-3xl border border-gray-200 p-8 space-y-4 shadow-lg"
              >
                <div className="skeleton-line h-6 w-3/5"></div>
                <div className="skeleton-line h-4 w-2/5 mt-2"></div>
                <div className="h-px bg-gray-200 my-4"></div>
                <div className="skeleton-line h-4 w-full"></div>
                <div className="skeleton-line h-4 w-4/5"></div>
                <div className="skeleton-line h-4 w-3/5"></div>
                <div className="h-px bg-gray-200 my-4"></div>
                <div className="skeleton-line h-4 w-full"></div>
                <div className="skeleton-line h-4 w-2/3"></div>
                <div className="skeleton-line h-12 w-full mt-4 rounded-xl"></div>
              </motion.div>
            )}

            {recipe && !loading && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="recipe-reveal bg-white/90 backdrop-blur-sm border-2 border-orange-200 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 space-y-6 sm:space-y-8 shadow-2xl hover:shadow-3xl transition-all duration-500"
              >
              {/* Title row */}
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6 pb-6 sm:pb-8 border-b-2 border-gray-100">
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-xl flex-shrink-0">
                      <Utensils size={24} className="text-white sm:w-7 sm:h-7" strokeWidth={2.5} />
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">{recipe.title}</h2>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <div className="flex items-center gap-2 bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-300 px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl shadow-md">
                    <Timer size={16} className="text-orange-600 sm:w-[18px] sm:h-[18px]" strokeWidth={2.5} />
                    <span className="text-orange-700 font-bold text-sm sm:text-base">{recipe.estimatedTime} min</span>
                  </div>
                  {recipe.estimatedCost && (
                    <div className="flex items-center gap-2 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base text-green-700 font-bold shadow-md">
                      <span>{recipe.estimatedCost}</span>
                    </div>
                  )}
                  {recipe.cookingEquipment && (
                    <div className="flex items-center gap-2 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-base text-blue-700 font-bold shadow-md">
                      <span>{recipe.cookingEquipment}</span>
                    </div>
                  )}
                </div>
              </div>

              {recipe.healthBenefits?.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-6 bg-gradient-to-br from-green-50 to-green-100/50 border-2 border-green-300 rounded-2xl shadow-md"
                >
                  <p className="text-green-900 text-base flex items-start gap-4 leading-relaxed">
                    <div className="w-10 h-10 rounded-xl bg-green-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Heart size={20} className="text-green-700" strokeWidth={2.5} />
                    </div>
                    <span><strong className="font-bold text-lg">Health Benefits:</strong><br/>{recipe.healthBenefits.join(', ')}</span>
                  </p>
                </motion.div>
              )}

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-5">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                        <ShoppingCart size={20} className="text-orange-600" strokeWidth={2.5} />
                      </div>
                      Used Ingredients
                    </h3>
                    <ul className="space-y-2.5">
                      {recipe.usedIngredients?.map((x, i) => (
                        <motion.li 
                          key={x + i} 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + i * 0.05 }}
                          className="flex items-center gap-3 text-sm text-gray-700 font-medium"
                        >
                          <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 shadow-sm" />
                          {x}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  {recipe.optionalIngredients?.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center">
                          <Package size={20} className="text-gray-600" strokeWidth={2.5} />
                        </div>
                        Optional / Pantry
                      </h3>
                      <ul className="space-y-2.5">
                        {recipe.optionalIngredients.map((x, i) => (
                          <motion.li 
                            key={x + i} 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + i * 0.05 }}
                            className="flex items-center gap-3 text-sm text-gray-600 font-medium"
                          >
                            <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0" />
                            {x}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </div>

                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-200 flex items-center justify-center">
                      <ChefHat size={20} className="text-orange-700" strokeWidth={2.5} />
                    </div>
                    Cooking Steps
                  </h3>
                  <ol className="space-y-4">
                    {recipe.cookingSteps?.map((s, i) => (
                      <motion.li 
                        key={i} 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className="flex gap-4"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-md">
                          {i + 1}
                        </div>
                        <span className="text-sm text-gray-700 leading-relaxed font-medium pt-1">{s}</span>
                      </motion.li>
                    ))}
                  </ol>
                  <div className="mt-6 pt-5 border-t-2 border-gray-100 space-y-2">
                    {recipe.servings && (
                      <p className="text-sm text-gray-700 flex items-center gap-3 font-medium">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                          <Users size={16} className="text-orange-600" strokeWidth={2.5} />
                        </div>
                        <span><strong className="font-semibold">Servings:</strong> {recipe.servings}</span>
                      </p>
                    )}
                  </div>
                </motion.div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 sm:pt-8 border-t-2 border-gray-100">
                <motion.button 
                  onClick={() => navigate('/cook', { state: { recipe } })}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base hover:shadow-2xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 shadow-lg shadow-orange-200"
                >
                  <ChefHat size={20} className="sm:w-[22px] sm:h-[22px]" strokeWidth={2.5} /> Start Cooking
                </motion.button>
                <motion.button 
                  onClick={shareRecipe}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold hover:shadow-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 shadow-lg shadow-blue-200"
                >
                  <Share2 size={20} className="sm:w-[22px] sm:h-[22px]" strokeWidth={2.5} /> Share
                </motion.button>
                <motion.button 
                  onClick={shareOnWhatsApp}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold hover:shadow-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 shadow-lg shadow-green-200"
                >
                  <Share2 size={20} className="sm:w-[22px] sm:h-[22px]" strokeWidth={2.5} /> WhatsApp
                </motion.button>
                <motion.button 
                  onClick={saveRecipe} 
                  disabled={saving}
                  whileHover={!saving ? { scale: 1.02 } : {}}
                  whileTap={!saving ? { scale: 0.98 } : {}}
                  className={clsx(
                    'flex-1 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 shadow-lg',
                    saving 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 hover:shadow-xl'
                  )}
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Bookmark size={20} className="sm:w-[22px] sm:h-[22px]" strokeWidth={2.5} /> Save
                    </>
                  )}
                </motion.button>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 text-center font-medium">Access saved recipes anytime from your profile</p>

              {/* Feedback Section */}
              <div className="pt-6 border-t-2 border-gray-100">
                {!feedbackState.submitted ? (
                  <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-2xl">
                    <span className="text-sm font-medium text-gray-700">Was this recipe helpful?</span>
                    <div className="flex gap-3">
                      <motion.button
                        onClick={() => handleFeedback('helpful')}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-12 h-12 rounded-xl bg-white border-2 border-gray-200 hover:border-green-400 hover:bg-green-50 transition-all duration-200 flex items-center justify-center text-2xl shadow-sm hover:shadow-md"
                        aria-label="Helpful"
                      >
                        👍
                      </motion.button>
                      <motion.button
                        onClick={() => handleFeedback('not_helpful')}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-12 h-12 rounded-xl bg-white border-2 border-gray-200 hover:border-red-400 hover:bg-red-50 transition-all duration-200 flex items-center justify-center text-2xl shadow-sm hover:shadow-md"
                        aria-label="Not helpful"
                      >
                        👎
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center p-4 bg-green-50 border-2 border-green-200 rounded-2xl"
                  >
                    <p className="text-sm text-green-800 font-medium flex items-center justify-center gap-2">
                      <Check size={18} className="text-green-600" strokeWidth={2.5} />
                      Thanks for your feedback!
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Push Notification Prompt */}
              {recipe && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="p-6 bg-gradient-to-br from-orange-50 to-orange-100/50 border-2 border-orange-200 rounded-2xl shadow-sm"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-md">
                      <Bell size={24} className="text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-base font-bold text-gray-900 mb-1">
                        Want daily recipe ideas at 7pm?
                      </p>
                      <p className="text-sm text-gray-600">
                        We'll remind you to cook something real instead of ordering Swiggy
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <motion.button
                      onClick={handleSubscribe}
                      disabled={isLoading}
                      whileHover={!isLoading ? { scale: 1.02 } : {}}
                      whileTap={!isLoading ? { scale: 0.98 } : {}}
                      className="flex-1 px-5 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white border-none rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Setting up...' : 'Yes, remind me!'}
                    </motion.button>
                    <motion.button
                      onClick={handleDismiss}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-5 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      No thanks
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* What next */}
              <div className="pt-8 border-t-2 border-gray-100">
                <p className="text-lg font-bold text-gray-900 mb-5">What do you want to do next?</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <motion.button 
                    onClick={() => navigate('/recipes')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white border-2 border-gray-300 text-gray-700 text-base font-bold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-md hover:shadow-xl"
                  >
                    <Utensils size={20} strokeWidth={2.5} /> Explore More Recipes
                  </motion.button>
                  <motion.button 
                    onClick={() => navigate('/meal-planner')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white border-2 border-gray-300 text-gray-700 text-base font-bold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-md hover:shadow-xl"
                  >
                    <Salad size={20} strokeWidth={2.5} /> Plan My Meals
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
      <Toaster 
        position="bottom-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#111827',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}
