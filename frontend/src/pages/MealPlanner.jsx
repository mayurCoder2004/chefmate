import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';

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

    toast.loading('AI Nutritionist is planning your perfect meals... 🧠', {
      id: 'meal-loading',
      duration: 4000,
    });

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
      toast.dismiss('meal-loading');
      toast.success(`Perfect ${days}-day meal plan created! 🎉`, {
        icon: '📅',
        duration: 3000,
      });
    } catch (err) {
      setError(err.message);
      toast.dismiss('meal-loading');
      toast.error(`Oops! ${err.message} 😞`, {
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Save generated meal plan to user profile
  const saveMealPlan = async () => {
    if (!mealPlan.length) return;

    setSaving(true);
    
    toast.loading('Saving your amazing meal plan... 💾', {
      id: 'meal-saving',
    });

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

      toast.dismiss('meal-saving');
      toast.success('Meal plan saved successfully! 🎉✨', {
        icon: '💾',
        duration: 3000,
      });
    } catch (err) {
      toast.dismiss('meal-saving');
      toast.error(`Failed to save meal plan: ${err.message} 😞`, {
        duration: 4000,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-8 px-4 mt-20">
      {/* Background decorative elements */}
      <div className="fixed top-0 left-0 w-80 h-80 bg-gradient-to-br from-orange-300/10 to-amber-300/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-yellow-300/10 to-orange-300/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

      {/* Floating elements */}
      <div className="fixed top-20 right-20 w-4 h-4 bg-orange-400/40 rounded-full animate-float"></div>
      <div 
        className="fixed bottom-32 left-16 w-6 h-6 bg-amber-400/40 rounded-full animate-float"
        style={{ animationDelay: "2s" }}
      ></div>
      <div 
        className="fixed top-1/2 left-10 w-3 h-3 bg-yellow-400/40 rounded-full animate-float"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 drop-shadow-lg leading-tight">
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
              AI Meal Planner
            </span>
            <span className="text-4xl ml-3 inline-block animate-bounce">📅🍽️</span>
          </h1>
          <p className="text-xl text-orange-700/80 font-medium">
            Let our AI nutritionist plan your perfect meals! ✨
          </p>
        </div>

        {/* Main Input Section */}
        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border border-orange-200/50 space-y-6 group hover:shadow-3xl transition-all duration-500 overflow-hidden mb-8">
          {/* Pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22%23f97316%22 fill-opacity=%220.03%22%3E%3Cpath d=%22m0 40l40-40h-40v40zm40 0v-40h-40l40 40z%22/%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-orange-700 mb-6 flex items-center gap-2">
              ⚙️ Plan Your Meals
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-orange-700 mb-2 flex items-center gap-2">
                  📅 Number of Days
                </label>
                <input
                  type="number"
                  min="1"
                  max="14"
                  value={days}
                  onChange={e => setDays(e.target.value)}
                  placeholder="Days"
                  className="w-full border-2 border-orange-200/50 rounded-2xl px-4 py-3 outline-none focus:ring-4 focus:ring-orange-200/50 focus:border-orange-400 transition-all duration-300 bg-white/80 backdrop-blur-sm text-gray-700 placeholder-orange-300 shadow-inner"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-orange-700 mb-2 flex items-center gap-2">
                  🥗 Diet Preference
                </label>
                <select 
                  value={diet} 
                  onChange={e => setDiet(e.target.value)} 
                  className="w-full border-2 border-orange-200/50 rounded-2xl px-4 py-3 bg-white/80 backdrop-blur-sm focus:ring-4 focus:ring-orange-200/50 focus:border-orange-400 transition-all duration-300 shadow-inner text-gray-700"
                >
                  <option value="none">None</option>
                  <option value="veg">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="keto">Keto</option>
                  <option value="paleo">Paleo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-orange-700 mb-2 flex items-center gap-2">
                  🔥 Calories/Day
                </label>
                <input
                  type="number"
                  value={calories}
                  onChange={e => setCalories(e.target.value)}
                  placeholder="e.g. 2000"
                  className="w-full border-2 border-orange-200/50 rounded-2xl px-4 py-3 outline-none focus:ring-4 focus:ring-orange-200/50 focus:border-orange-400 transition-all duration-300 bg-white/80 backdrop-blur-sm text-gray-700 placeholder-orange-300 shadow-inner"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={fetchMealPlan}
                  disabled={loading}
                  className={`w-full font-bold py-3 px-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 text-lg flex items-center justify-center gap-3 ${
                    loading 
                      ? "bg-gray-200/80 text-gray-400 cursor-not-allowed" 
                      : "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white"
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400 mr-2"></div>
                      Planning...
                    </>
                  ) : (
                    "✨ Generate Plan"
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl">
                <p className="text-red-700 font-semibold flex items-center gap-2">
                  ❌ {error}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Loading Animation */}
        {loading && !mealPlan.length && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-orange-200/50 space-y-4 mb-8">
            <div className="text-center mb-6">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-500 mb-4"></div>
              <p className="text-xl text-orange-700 font-semibold">
                🧠 AI Nutritionist is planning your perfect meals...
              </p>
            </div>
            <div className="space-y-3">
              <div className="h-6 w-3/4 bg-gradient-to-r from-orange-200/50 to-amber-200/50 rounded-full animate-pulse"></div>
              <div className="h-4 w-1/2 bg-gradient-to-r from-amber-200/50 to-yellow-200/50 rounded-full animate-pulse"></div>
              <div className="h-32 bg-gradient-to-br from-orange-100/50 to-amber-100/50 rounded-2xl animate-pulse"></div>
            </div>
          </div>
        )}

        {/* Meal Plan Display */}
        {mealPlan.length > 0 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
                  Your Perfect Meal Plan
                </span>
                <span className="text-2xl ml-2 inline-block animate-bounce">🎯</span>
              </h2>
              <p className="text-orange-700/80 font-medium mt-2">
                {days} days of delicious, balanced meals just for you! 
              </p>
            </div>

            {mealPlan.map((day, dayIndex) => (
              <div key={day.day} className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-orange-200/50 group hover:shadow-3xl transition-all duration-500 overflow-hidden">
                {/* Pattern overlay */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22%23f97316%22 fill-opacity=%220.02%22%3E%3Cpath d=%22m0 40l40-40h-40v40zm40 0v-40h-40l40 40z%22/%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {day.day}
                    </div>
                    <h2 className="text-2xl font-bold text-orange-700">
                      Day {day.day} Menu
                    </h2>
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-orange-200 to-transparent"></div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {day.meals.map((meal, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-amber-50/80 to-yellow-50/80 backdrop-blur-sm rounded-2xl p-5 border border-amber-200/50 shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl">
                            {idx === 0 ? '🌅' : idx === 1 ? '☀️' : idx === 2 ? '🌅' : '🌙'}
                          </span>
                          <h3 className="font-bold text-amber-700 text-lg">
                            {meal.name}
                          </h3>
                          {meal.calories && (
                            <span className="ml-auto bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full border border-orange-200">
                              🔥 {meal.calories} cal
                            </span>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div>
                            <h4 className="font-semibold text-amber-700 mb-2 flex items-center gap-2">
                              🥬 Ingredients:
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {meal.ingredients.map((ingredient, i) => (
                                <span key={i} className="text-xs bg-white/70 text-amber-700 px-2 py-1 rounded-full border border-amber-200/50 font-medium">
                                  {ingredient}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-amber-700 mb-2 flex items-center gap-2">
                              👨‍🍳 Instructions:
                            </h4>
                            <p className="text-amber-800 text-sm leading-relaxed bg-white/50 p-3 rounded-xl border border-amber-100">
                              {meal.instructions}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Save Button */}
            <div className="text-center mt-8">
              <button
                onClick={saveMealPlan}
                disabled={saving}
                className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden text-lg flex items-center justify-center gap-3"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Saving Plan...
                    </>
                  ) : (
                    <>
                      💾 Save Meal Plan
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* React Hot Toast Container */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
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
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            maxWidth: '400px',
          },
          // Custom styles for different types
          success: {
            style: {
              background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
              color: '#065f46',
              border: '2px solid rgba(34, 197, 94, 0.3)',
            },
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            style: {
              background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
              color: '#991b1b',
              border: '2px solid rgba(239, 68, 68, 0.3)',
            },
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
          loading: {
            style: {
              background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
              color: '#3730a3',
              border: '2px solid rgba(99, 102, 241, 0.3)',
            },
            iconTheme: {
              primary: '#6366f1',
              secondary: '#ffffff',
            },
          },
        }}
      />

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(180deg);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}