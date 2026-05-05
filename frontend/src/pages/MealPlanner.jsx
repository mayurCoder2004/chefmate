import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import { AuthContext } from "../contexts/AuthContext";
import { Calendar, Salad, Flame, Sparkles, Settings, ChefHat, ShoppingCart, Bookmark, XCircle, Brain, Utensils, Sunrise, Sun, Moon } from 'lucide-react';

export default function MealPlanner() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
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

    toast.loading('AI Nutritionist is planning your perfect meals...', {
      id: 'meal-loading',
      duration: 4000,
    });

    try {
      const body = { days: Number(days), diet, calories: calories ? Number(calories) : undefined };

      const res = await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:5000'}/api/meal-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Failed to fetch meal plan");

      setMealPlan(data.mealPlan);
      toast.dismiss('meal-loading');
      toast.success(`Perfect ${days}-day meal plan created!`, {
        icon: null,
        duration: 3000,
      });
    } catch (err) {
      setError(err.message);
      toast.dismiss('meal-loading');
      toast.error(`Oops! ${err.message}`, {
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Save generated meal plan to user profile
  const saveMealPlan = async () => {
    if (!mealPlan.length) return;

    // Check login before saving
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Login to save your meal plan 🍽️", { duration: 3000 });
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    setSaving(true);
    
    toast.loading('Saving your amazing meal plan...', {
      id: 'meal-saving',
    });

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:5000'}/api/meal-plan/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ mealPlan, diet })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Failed to save meal plan");

      toast.dismiss('meal-saving');
      toast.success('Meal plan saved successfully!', {
        icon: null,
        duration: 3000,
      });
    } catch (err) {
      toast.dismiss('meal-saving');
      toast.error(`Failed to save meal plan: ${err.message}`, {
        duration: 4000,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 mt-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <Calendar size={28} className="text-orange-600" />
            AI Meal Planner
          </h1>
          <p className="text-lg text-gray-600">Let our AI nutritionist plan your perfect meals!</p>
        </div>

        {/* Main Input Section - Always visible */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-lg transition duration-200 space-y-5">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Settings size={20} className="text-orange-600" /> Plan Your Meals
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Calendar size={14} /> Number of Days
              </label>
              <input
                type="number"
                min="1"
                max="14"
                value={days}
                onChange={e => setDays(e.target.value)}
                placeholder="Days"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Salad size={14} /> Diet Preference
              </label>
              <select 
                value={diet} 
                onChange={e => setDiet(e.target.value)} 
                className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition text-gray-700"
              >
                <option value="none">None</option>
                <option value="veg">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="keto">Keto</option>
                <option value="paleo">Paleo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Flame size={14} /> Calories/Day
              </label>
              <input
                type="number"
                value={calories}
                onChange={e => setCalories(e.target.value)}
                placeholder="e.g. 2000"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition text-gray-700"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={fetchMealPlan}
                disabled={loading}
                className={`w-full font-medium py-2.5 px-5 rounded-lg transition duration-200 flex items-center justify-center gap-2 ${
                  loading 
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                    : "bg-orange-500 text-white hover:bg-orange-600 hover:scale-[1.02]"
                }`}
              >
                {loading ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                    Planning...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} /> Generate Plan
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium flex items-center gap-2">
                <XCircle size={16} /> {error}
              </p>
            </div>
          )}
        </div>

        {/* Loading Animation */}
        {loading && !mealPlan.length && (
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-6 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-orange-200 border-t-orange-500 mb-4"></div>
            <p className="text-lg font-medium text-orange-600 flex items-center justify-center gap-2">
              <Brain size={18} /> AI Nutritionist is planning your perfect meals...
            </p>
          </div>
        )}

        {/* Meal Plan Display */}
        {mealPlan.length > 0 && (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center justify-center gap-2">
                <Utensils size={24} className="text-orange-600" />
                Your Perfect Meal Plan
              </h2>
              <p className="text-gray-600 mt-1">
                {days} days of delicious, balanced meals just for you! 
              </p>
            </div>

            {mealPlan.map((day) => (
              <div key={day.day} className="bg-white border border-orange-100 rounded-xl p-5 shadow-md hover:shadow-lg transition duration-200">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {day.day}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Day {day.day} Menu
                  </h3>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {day.meals.map((meal, idx) => (
                    <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-sm transition duration-200">
                      <div className="flex items-center gap-2 mb-3">
                        <span>
                          {idx === 0 ? <Sunrise size={18} className="text-orange-600" /> : idx === 1 ? <Sun size={18} className="text-orange-600" /> : idx === 2 ? <Sunrise size={18} className="text-orange-600" /> : <Moon size={18} className="text-orange-600" />}
                        </span>
                        <h4 className="font-medium text-gray-800">
                          {meal.name}
                        </h4>
                        {meal.calories && (
                          <span className="ml-auto bg-orange-50 border border-orange-200 text-orange-700 text-xs font-medium px-2 py-1 rounded-lg flex items-center gap-1">
                            <Flame size={11} /> {meal.calories}
                          </span>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                            <ShoppingCart size={14} /> Ingredients:
                          </h5>
                          <div className="flex flex-wrap gap-1">
                            {meal.ingredients.map((ingredient, i) => (
                              <span key={i} className="text-xs bg-white border border-gray-200 text-gray-700 px-2 py-1 rounded-lg">
                                {ingredient}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                            <ChefHat size={14} /> Instructions:
                          </h5>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {meal.instructions}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Save Button */}
            <div className="text-center mt-6">
              <button
                onClick={saveMealPlan}
                disabled={saving}
                className={`px-5 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition duration-200 hover:scale-[1.02] flex items-center justify-center gap-2 mx-auto ${
                  saving ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving Plan...
                  </>
                ) : (
                  <>
                    <Bookmark size={18} /> Save Meal Plan
                  </>
                )}
              </button>
              {!user && (
                <p className="text-xs text-gray-500 mt-2">
                  Login required to save your meal plan
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}