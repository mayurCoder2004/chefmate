import { useMemo, useState } from 'react';
import clsx from 'clsx';

const chipStyle = "px-2 py-1 rounded-full bg-gray-100 border border-gray-200 text-sm";
const btnStyle = "rounded-xl px-4 py-2 font-medium shadow-sm border border-gray-200 hover:shadow transition";

export default function SmartRecipe() {
  const [input, setInput] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [diet, setDiet] = useState('none'); // none | veg | vegan | keto | paleo
  const [maxTime, setMaxTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState('');

  const canSubmit = useMemo(() => ingredients.length > 0 && !loading, [ingredients, loading]);

  function addFromInput() {
    const raw = input.trim();
    if (!raw) return;
    const parts = raw.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    const next = [...new Set([...ingredients, ...parts])].slice(0, 20);
    setIngredients(next);
    setInput('');
  }

  function removeIngredient(i) {
    setIngredients(prev => prev.filter((_, idx) => idx !== i));
  }

  async function fetchSmartRecipe() {
    setLoading(true); setError(''); setRecipe(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:5000'}/api/smart-recipe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients,
          prefs: {
            diet,
            ...(maxTime ? { maxTime: Number(maxTime) } : {})
          }
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');

      setRecipe(data);
    } catch (e) {
      setError(e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-4">Smart Recipe</h1>

      <div className="bg-white border rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        <label className="block text-sm font-medium">Ingredients</label>
        <div className="flex gap-2">
          <input
            className="flex-1 border rounded-xl px-3 py-2 outline-none focus:ring focus:ring-emerald-200"
            placeholder="e.g. chicken, spinach, tomato"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFromInput(); } }}
          />
          <button onClick={addFromInput} className={clsx(btnStyle, "bg-emerald-600 text-white")}>Add</button>
        </div>

        {ingredients.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ing, i) => (
              <span key={ing + i} className={chipStyle}>
                {ing}
                <button className="ml-2 text-gray-500 hover:text-red-500" onClick={() => removeIngredient(i)}>×</button>
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <div>
            <label className="text-sm mr-2">Diet</label>
            <select
              value={diet}
              onChange={e => setDiet(e.target.value)}
              className="border rounded-xl px-3 py-2"
            >
              <option value="none">None</option>
              <option value="veg">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="keto">Keto</option>
              <option value="paleo">Paleo</option>
            </select>
          </div>
          <div>
            <label className="text-sm mr-2">Max time (min)</label>
            <input
              type="number"
              min="5"
              max="240"
              className="border rounded-xl px-3 py-2 w-28"
              value={maxTime}
              onChange={e => setMaxTime(e.target.value)}
              placeholder="e.g. 30"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            disabled={!canSubmit}
            onClick={fetchSmartRecipe}
            className={clsx(btnStyle, canSubmit ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-400")}
          >
            {loading ? "Thinking..." : "Get Best Recipe"}
          </button>
          <button onClick={() => { setIngredients([]); setRecipe(null); }} className={btnStyle}>Reset</button>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
      </div>

      {/* Result */}
      {loading && !recipe && (
        <div className="mt-6 space-y-2">
          <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-32 bg-gray-100 rounded animate-pulse"></div>
        </div>
      )}

      {recipe && !loading && (
        <div className="mt-6 bg-white border rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-xl font-semibold">{recipe.title}</h2>
            <span className="text-sm bg-gray-100 border px-2 py-1 rounded">⏱ {recipe.estimatedTime} min</span>
          </div>
          {!!recipe.healthBenefits && (
            <p className="text-sm text-gray-700"><strong>Why it’s healthy:</strong> {recipe.healthBenefits}</p>
          )}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-1">Used Ingredients</h3>
              <ul className="list-disc list-inside text-sm">
                {(recipe.usedIngredients || []).map((x, i) => <li key={x + i}>{x}</li>)}
              </ul>
              {(recipe.optionalIngredients?.length > 0) && (
                <>
                  <h3 className="font-medium mt-4 mb-1">Optional / Pantry</h3>
                  <ul className="list-disc list-inside text-sm">
                    {recipe.optionalIngredients.map((x, i) => <li key={x + i}>{x}</li>)}
                  </ul>
                </>
              )}
            </div>
            <div>
              <h3 className="font-medium mb-1">Steps</h3>
              <ol className="list-decimal list-inside text-sm space-y-1">
                {recipe.cookingSteps.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
              {recipe.servings && (
                <p className="text-sm text-gray-600 mt-3">Servings: {recipe.servings}</p>
              )}
              {recipe.notes && (
                <p className="text-sm text-gray-600 mt-1">{recipe.notes}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
