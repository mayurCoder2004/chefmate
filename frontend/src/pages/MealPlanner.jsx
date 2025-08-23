import { useState } from "react";

export default function MealPlanner() {
  const [days, setDays] = useState(3);
  const [diet, setDiet] = useState("none");
  const [calories, setCalories] = useState("");
  const [mealPlan, setMealPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Fetch meal plan from backend
  const fetchMealPlan = async () => {
    setLoading(true);
    setError("");
    setMealPlan([]);

    try {
      const token = localStorage.getItem("token");
      const body = { days: Number(days), diet, calories: calories ? Number(calories) : undefined };

      const res = await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:5000'}/api/meal-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch meal plan");

      setMealPlan(data.mealPlan);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Save generated meal plan to user profile
  const saveMealPlan = async () => {
    if (!mealPlan.length) return;

    setSaving(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:5000'}/api/meal-plan/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ mealPlan, diet })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save meal plan");

      alert("Meal plan saved successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-primary">AI Meal Planner</h1>

      {/* Inputs */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="number"
          min="1"
          max="14"
          value={days}
          onChange={e => setDays(e.target.value)}
          placeholder="Days"
          className="border rounded px-3 py-2 w-24"
        />
        <select value={diet} onChange={e => setDiet(e.target.value)} className="border rounded px-3 py-2">
          <option value="none">None</option>
          <option value="veg">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="keto">Keto</option>
          <option value="paleo">Paleo</option>
        </select>
        <input
          type="number"
          value={calories}
          onChange={e => setCalories(e.target.value)}
          placeholder="Calories/day"
          className="border rounded px-3 py-2 w-32"
        />
        <button
          onClick={fetchMealPlan}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-accent"
        >
          Generate
        </button>
      </div>

      {/* Loading / Error */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* Meal Plan Display */}
      <div className="space-y-6 mt-6">
        {mealPlan.map(day => (
          <div key={day.day} className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-bold mb-2 text-primary">Day {day.day}</h2>
            {day.meals.map((meal, idx) => (
              <div key={idx} className="mb-2 border-b pb-2">
                <h3 className="font-semibold">
                  {meal.name} {meal.calories && `(Calories: ${meal.calories})`}
                </h3>
                <p><strong>Ingredients:</strong> {meal.ingredients.join(", ")}</p>
                <p><strong>Instructions:</strong> {meal.instructions}</p>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Save Button */}
      {mealPlan.length > 0 && (
        <button
          onClick={saveMealPlan}
          disabled={saving}
          className={`mt-4 px-4 py-2 rounded text-white ${saving ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
        >
          {saving ? "Saving..." : "Save Meal Plan"}
        </button>
      )}
    </div>
  );
}
