import { useMemo, useState } from 'react';
import clsx from 'clsx';
import toast, { Toaster } from 'react-hot-toast';

const btnStyle =
  'rounded-xl px-6 py-3 font-semibold shadow-lg border border-orange-200/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 backdrop-blur-sm';

// ── Predefined ingredients grouped loosely ────────────────────────────────────
const PREDEFINED_INGREDIENTS = [
  "onion",
  "tomato",
  "potato",
  "green chili",
  "garlic",
  "ginger",

  "rice",
  "atta",
  "roti",
  "bread",
  "maggi",
  "poha",

  "egg",
  "paneer",
  "milk",
  "curd",

  "salt",
  "turmeric",
  "red chili powder",
  "garam masala",

  "oil",
  "butter",
  "ghee",

  "ketchup",
  "peanut butter"
];

export default function SmartRecipe() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [customInput, setCustomInput] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [diet, setDiet] = useState('none');
  const [maxTime, setMaxTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Alias used by fetchSmartRecipe (no backend change needed)
  const ingredients = selectedIngredients;

  const canSubmit = useMemo(
    () => selectedIngredients.length > 0 && !loading,
    [selectedIngredients, loading]
  );

  // ── Helpers ────────────────────────────────────────────────────────────────
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

  // ── Ingredient chip toggle ─────────────────────────────────────────────────
  function toggleIngredient(name) {
    setSelectedIngredients((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  }

  // ── Custom ingredient (Enter key) ──────────────────────────────────────────
  function handleCustomInput(e) {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const raw = customInput.trim().toLowerCase();
    if (!raw) return;
    const parts = raw.split(',').map((s) => s.trim()).filter(Boolean);
    setSelectedIngredients((prev) => {
      const next = [...new Set([...prev, ...parts])].slice(0, 20);
      const added = next.length - prev.length;
      if (added > 0)
        toast.success(`Added ${added} ingredient${added > 1 ? 's' : ''}! 🎉`, {
          icon: '🥗',
          duration: 2000,
        });
      else toast('Already added! 😊', { icon: '💡', duration: 2000 });
      if (next.length >= 20)
        toast('Max 20 ingredients reached! 🔥', { icon: '📝', duration: 3000 });
      return next;
    });
    setCustomInput('');
  }

  // ── Remove a custom (non-predefined) chip ──────────────────────────────────
  function removeCustomIngredient(name) {
    setSelectedIngredients((prev) => prev.filter((i) => i !== name));
    toast.success(`Removed "${name}" 🗑️`, { icon: '✅', duration: 1500 });
  }

  // ── API: Generate recipe (UNCHANGED) ──────────────────────────────────────
  async function fetchSmartRecipe() {
    setLoading(true);
    setError('');
    setRecipe(null);

    toast.loading('AI Chef is analyzing your ingredients... 🧠', {
      id: 'recipe-loading',
      duration: 4000,
    });

    try {
      const res = await fetch(
        `${import.meta.env?.VITE_BASE_URL || 'http://localhost:5000'}/api/smart-recipe`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ingredients,
            prefs: { diet, ...(maxTime ? { maxTime: Number(maxTime) } : {}) },
          }),
        }
      );

      let data;
      try {
        data = await res.json();
      } catch {
        const text = await res.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned invalid JSON');
      }

      if (!res.ok) throw new Error(data.error || 'Failed');

      const normalized = normalizeRecipePayload(data);
      if (!normalized) throw new Error('Recipe payload is invalid');
      setRecipe(normalized);
      toast.dismiss('recipe-loading');
      toast.success('Perfect recipe created! 🎉✨', { icon: '👨‍🍳', duration: 3000 });
    } catch (e) {
      toast.dismiss('recipe-loading');
      setError(e.message || 'Something went wrong');
      toast.error(`Oops! ${e.message || 'Something went wrong'} 😞`, { duration: 4000 });
    } finally {
      setLoading(false);
    }
  }

  // ── API: Save recipe (UNCHANGED) ───────────────────────────────────────────
  async function saveRecipe() {
    if (!recipe) return;
    setSaving(true);

    toast.loading('Saving your amazing recipe... 💾', { id: 'recipe-saving' });

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please login first to save recipes');

      const res = await fetch(
        `${import.meta.env?.VITE_BASE_URL || 'http://localhost:5000'}/api/recipes/save`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(recipe),
        }
      );

      let data;
      try {
        data = await res.json();
      } catch {
        const text = await res.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned invalid JSON');
      }

      if (!res.ok) throw new Error(data.error || 'Failed to save recipe');

      toast.dismiss('recipe-saving');
      toast.success('Recipe saved successfully! 🎉✨', { icon: '💾', duration: 3000 });
    } catch (err) {
      toast.dismiss('recipe-saving');
      toast.error(`Failed to save recipe: ${err.message} 😞`, { duration: 4000 });
    } finally {
      setSaving(false);
    }
  }

  // ── Derived: custom chips (selected but not predefined) ────────────────────
  const customChips = selectedIngredients.filter(
    (i) => !PREDEFINED_INGREDIENTS.includes(i)
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-8 px-4 mt-20">
      {/* Background blobs */}
      <div className="fixed top-0 left-0 w-80 h-80 bg-gradient-to-br from-orange-300/10 to-amber-300/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-yellow-300/10 to-orange-300/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

      {/* Floating dots */}
      <div className="fixed top-20 right-20 w-4 h-4 bg-orange-400/40 rounded-full animate-float" />
      <div className="fixed bottom-32 left-16 w-6 h-6 bg-amber-400/40 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      <div className="fixed top-1/2 left-10 w-3 h-3 bg-yellow-400/40 rounded-full animate-float" style={{ animationDelay: '1s' }} />

      <div className="mx-auto max-w-4xl relative z-10">

        {/* ── Header ── */}
        <div className="text-center mb-8">
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 drop-shadow-lg leading-tight">
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
              Smart Recipe
            </span>
            <span className="text-4xl ml-3 inline-block animate-bounce">🧠👨‍🍳</span>
          </h1>
          <p className="text-xl text-orange-700/80 font-medium">
            Pick your ingredients and I'll create magic! ✨
          </p>
        </div>

        {/* ── Input card ── */}
        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border border-orange-200/50 hover:shadow-3xl transition-all duration-500 overflow-hidden mb-8">
          {/* subtle pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22%23f97316%22 fill-opacity=%220.03%22%3E%3Cpath d=%22m0 40l40-40h-40v40zm40 0v-40h-40l40 40z%22/%3E%3C/g%3E%3C/svg%3E')] opacity-30" />

          <div className="relative z-10 space-y-6">

            {/* ── Predefined chips ── */}
            <div>
              <label className="block text-lg font-bold text-orange-700 mb-3">
                🥬 Pick Your Ingredients
              </label>
              <div className="flex flex-wrap gap-2">
                {PREDEFINED_INGREDIENTS.map((name) => {
                  const selected = selectedIngredients.includes(name);
                  return (
                    <button
                      key={name}
                      onClick={() => toggleIngredient(name)}
                      className={clsx(
                        'px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm select-none',
                        selected
                          ? 'bg-orange-500 border-orange-500 text-white shadow-orange-200 shadow-md'
                          : 'bg-white border-orange-200 text-orange-700 hover:border-orange-400'
                      )}
                    >
                      {selected ? '✓ ' : ''}{name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Custom ingredient input ── */}
            <div>
              <label className="block text-sm font-semibold text-orange-600 mb-2">
                ✏️ Add a custom ingredient — press <kbd className="px-1.5 py-0.5 bg-orange-100 border border-orange-200 rounded text-xs font-mono">Enter</kbd>
              </label>
              <input
                className="w-full border-2 border-orange-200/50 rounded-2xl px-4 py-2.5 outline-none focus:ring-4 focus:ring-orange-200/50 focus:border-orange-400 transition-all duration-300 bg-white/80 text-gray-700 placeholder-orange-300 shadow-inner text-sm"
                placeholder="e.g. avocado, coconut milk…"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={handleCustomInput}
              />
            </div>

            {/* ── Custom chips (removable) ── */}
            {customChips.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {customChips.map((name) => (
                  <span
                    key={name}
                    className="px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold shadow-md flex items-center gap-1"
                  >
                    {name}
                    <button
                      onClick={() => removeCustomIngredient(name)}
                      className="ml-1 hover:text-red-200 font-bold transition-colors"
                      aria-label={`Remove ${name}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* ── Selection count ── */}
            <p className="text-sm font-medium text-orange-600">
              {selectedIngredients.length} ingredient{selectedIngredients.length !== 1 ? 's' : ''} selected
            </p>

            {/* ── Diet & time filters ── */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <label className="text-lg font-semibold text-orange-700">🥗 Diet</label>
                <select
                  value={diet}
                  onChange={(e) => setDiet(e.target.value)}
                  className="border-2 border-orange-200/50 rounded-xl px-4 py-2 bg-white/80 backdrop-blur-sm focus:ring-4 focus:ring-orange-200/50 focus:border-orange-400 transition-all duration-300 shadow-sm"
                >
                  <option value="none">None</option>
                  <option value="veg">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="keto">Keto</option>
                  <option value="paleo">Paleo</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-lg font-semibold text-orange-700">⏰ Max time (min)</label>
                <input
                  type="number"
                  min="5"
                  max="240"
                  className="border-2 border-orange-200/50 rounded-xl px-4 py-2 w-32 bg-white/80 backdrop-blur-sm focus:ring-4 focus:ring-orange-200/50 focus:border-orange-400 transition-all duration-300 shadow-sm"
                  value={maxTime}
                  onChange={(e) => setMaxTime(e.target.value)}
                  placeholder="e.g. 30"
                />
              </div>
            </div>

            {/* ── Action buttons ── */}
            <div className="flex items-center gap-4">
              <button
                disabled={!canSubmit}
                onClick={fetchSmartRecipe}
                className={clsx(
                  btnStyle,
                  'text-lg font-bold',
                  canSubmit
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-xl hover:shadow-2xl'
                    : 'bg-gray-200/80 text-gray-400 cursor-not-allowed border-gray-200'
                )}
              >
                {loading ? (
                  <>
                    <span className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Generating recipe…
                  </>
                ) : (
                  '🍳 Find My Recipe'
                )}
              </button>

              <button
                onClick={() => {
                  setSelectedIngredients([]);
                  setRecipe(null);
                  toast.success('Everything cleared! Ready for new ingredients 🔄', {
                    icon: '✨',
                    duration: 2000,
                  });
                }}
                className={clsx(
                  btnStyle,
                  'bg-gradient-to-r from-gray-100/80 to-gray-200/80 hover:from-gray-200/80 hover:to-gray-300/80 text-gray-700'
                )}
              >
                🔄 Reset
              </button>
            </div>

            {/* ── Error message ── */}
            {error && (
              <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl">
                <p className="text-red-700 font-semibold flex items-center gap-2">❌ {error}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Loading skeleton ── */}
        {loading && !recipe && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-orange-200/50 space-y-4 mt-8">
            <div className="text-center mb-6">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-500 mb-4" />
              <p className="text-xl text-orange-700 font-semibold">
                🧠 AI Chef is creating your perfect recipe…
              </p>
            </div>
            <div className="space-y-3">
              <div className="h-6 w-3/4 bg-gradient-to-r from-orange-200/50 to-amber-200/50 rounded-full animate-pulse" />
              <div className="h-4 w-1/2 bg-gradient-to-r from-amber-200/50 to-yellow-200/50 rounded-full animate-pulse" />
              <div className="h-32 bg-gradient-to-br from-orange-100/50 to-amber-100/50 rounded-2xl animate-pulse" />
            </div>
          </div>
        )}

        {/* ── Recipe result ── */}
        {recipe && !loading && (
          <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-orange-200/50 space-y-6 group hover:shadow-3xl transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22%23f97316%22 fill-opacity=%220.02%22%3E%3Cpath d=%22m0 40l40-40h-40v40zm40 0v-40h-40l40 40z%22/%3E%3C/g%3E%3C/svg%3E')] opacity-50" />

            <div className="relative z-10">
              <div className="flex items-start justify-between gap-4 mb-6">
                <h2 className="text-3xl lg:text-4xl font-extrabold">
                  <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
                    {recipe.title}
                  </span>
                  <span className="text-2xl ml-2 inline-block animate-bounce">🍽️</span>
                </h2>
                <div className="flex items-center gap-2 bg-gradient-to-r from-orange-100/80 to-amber-100/80 backdrop-blur-sm border border-orange-200/50 px-4 py-2 rounded-full shadow-sm">
                  <span className="text-orange-700 font-bold text-lg">⏱️ {recipe.estimatedTime} min</span>
                </div>
              </div>

              {recipe.healthBenefits?.length > 0 && (
                <div className="mb-6 p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 backdrop-blur-sm border-2 border-green-200/50 rounded-2xl">
                  <p className="text-green-800 font-semibold flex items-start gap-2">
                    <span className="text-xl">💚</span>
                    <span>
                      <strong>Why it's healthy:</strong> {recipe.healthBenefits.join(', ')}
                    </span>
                  </p>
                </div>
              )}

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Ingredients */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-orange-50/80 to-amber-50/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-200/50">
                    <h3 className="text-2xl font-bold text-orange-700 mb-4 flex items-center gap-2">
                      🥬 Used Ingredients
                    </h3>
                    <ul className="space-y-2">
                      {recipe.usedIngredients?.map((x, i) => (
                        <li key={x + i} className="flex items-center gap-3 text-gray-700 font-medium">
                          <span className="w-2 h-2 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full" />
                          {x}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {recipe.optionalIngredients?.length > 0 && (
                    <div className="bg-gradient-to-br from-amber-50/80 to-yellow-50/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50">
                      <h3 className="text-2xl font-bold text-amber-700 mb-4">🧂 Optional / Pantry</h3>
                      <ul className="space-y-2">
                        {recipe.optionalIngredients.map((x, i) => (
                          <li key={x + i} className="flex items-center gap-3 text-gray-700 font-medium">
                            <span className="w-2 h-2 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full" />
                            {x}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Steps */}
                <div className="bg-gradient-to-br from-yellow-50/80 to-orange-50/80 backdrop-blur-sm rounded-2xl p-6 border border-yellow-200/50">
                  <h3 className="text-2xl font-bold text-yellow-700 mb-4">👨‍🍳 Steps</h3>
                  <ol className="space-y-3">
                    {recipe.cookingSteps?.map((s, i) => (
                      <li key={i} className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {i + 1}
                        </span>
                        <span className="text-gray-700 font-medium leading-relaxed">{s}</span>
                      </li>
                    ))}
                  </ol>

                  <div className="mt-6 pt-4 border-t border-yellow-200/50 space-y-2">
                    {recipe.servings && (
                      <p className="text-yellow-700 font-semibold flex items-center gap-2">
                        👥 <strong>Servings:</strong> {recipe.servings}
                      </p>
                    )}
                    {recipe.notes && (
                      <p className="text-yellow-700 font-medium flex items-start gap-2">
                        📝 <span>{recipe.notes}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Save button */}
              <div className="mt-8 text-center">
                <button
                  onClick={saveRecipe}
                  disabled={saving}
                  className={clsx(
                    'relative bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden text-lg',
                    saving && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        Saving…
                      </>
                    ) : (
                      '💾 Save Recipe'
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast container */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          className: '',
          duration: 3000,
          style: {
            background: 'linear-gradient(135deg, #fed7aa, #fde68a)',
            color: '#92400e',
            fontWeight: '600',
            fontSize: '14px',
            borderRadius: '16px',
            border: '2px solid rgba(251, 146, 60, 0.3)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
            maxWidth: '400px',
          },
          success: {
            style: {
              background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
              color: '#065f46',
              border: '2px solid rgba(34,197,94,0.3)',
            },
            iconTheme: { primary: '#10b981', secondary: '#ffffff' },
          },
          error: {
            style: {
              background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
              color: '#991b1b',
              border: '2px solid rgba(239,68,68,0.3)',
            },
            iconTheme: { primary: '#ef4444', secondary: '#ffffff' },
          },
          loading: {
            style: {
              background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
              color: '#3730a3',
              border: '2px solid rgba(99,102,241,0.3)',
            },
            iconTheme: { primary: '#6366f1', secondary: '#ffffff' },
          },
        }}
      />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-15px) rotate(180deg); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
