import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// Toast Notification Component
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' 
    ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
    : type === 'error'
    ? 'bg-gradient-to-r from-red-500 to-pink-500'
    : 'bg-gradient-to-r from-blue-500 to-indigo-500';

  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${bgColor} text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-sm max-w-sm`}>
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <p className="font-semibold flex-1">{message}</p>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white text-xl font-bold transition-colors"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

// Custom Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, recipeName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-orange-200/50 animate-scale-in">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🗑️</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Delete Recipe?
          </h3>
          <p className="text-gray-600">
            Are you sure you want to remove <span className="font-semibold text-orange-600">"{recipeName}"</span> from your saved recipes?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This action cannot be undone.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [savedRecipes, setSavedRecipes] = useState([]);
  const [savedMealPlans, setSavedMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    recipeId: null,
    recipeName: ''
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Fetch saved recipes and meal plans
  const fetchSavedData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Recipes
      const resRecipes = await fetch(`${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}/api/recipes/saved`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const dataRecipes = await resRecipes.json();
      if (!resRecipes.ok) throw new Error(dataRecipes.error || "Failed to fetch recipes");
      setSavedRecipes(dataRecipes.savedRecipes || []);

      // Meal Plans
      const resPlans = await fetch(`${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}/api/meal-plan`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const dataPlans = await resPlans.json();
      if (!resPlans.ok) throw new Error(dataPlans.error || "Failed to fetch meal plans");
      setSavedMealPlans(dataPlans.savedMealPlans || []);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedData();
  }, []);

  const openConfirmModal = (id, recipeName) => {
    setConfirmModal({
      isOpen: true,
      recipeId: id,
      recipeName: recipeName
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal({
      isOpen: false,
      recipeId: null,
      recipeName: ''
    });
  };

  const handleRemoveRecipe = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}/api/recipes/remove/${confirmModal.recipeId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove recipe");
      
      setSavedRecipes(data.savedRecipes);
      showToast(`"${confirmModal.recipeName}" has been removed from your saved recipes! 🗑️`, 'success');
      closeConfirmModal();
    } catch (err) {
      showToast(err.message, 'error');
      closeConfirmModal();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-8 px-4 mt-20">
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={hideToast} 
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={handleRemoveRecipe}
        recipeName={confirmModal.recipeName}
      />

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

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 drop-shadow-lg leading-tight">
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
              My Profile
            </span>
            <span className="text-4xl ml-3 inline-block animate-bounce">👨‍🍳✨</span>
          </h1>
          <p className="text-xl text-orange-700/80 font-medium">
            Welcome back, {user?.name}! 🎉
          </p>
        </div>

        {/* Main Content Container */}
        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border border-orange-200/50 group hover:shadow-3xl transition-all duration-500 overflow-hidden">
          {/* Pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22%23f97316%22 fill-opacity=%220.03%22%3E%3Cpath d=%22m0 40l40-40h-40v40zm40 0v-40h-40l40 40z%22/%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
          
          <div className="relative z-10">
            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-500 mb-4"></div>
                <p className="text-xl text-orange-700 font-semibold">
                  🔍 Loading your culinary collection...
                </p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl mb-8">
                <p className="text-red-700 font-semibold flex items-center gap-2 text-center justify-center">
                  ❌ {error}
                </p>
              </div>
            )}

            {/* Saved Recipes Section */}
            {!loading && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
                      Your Saved Recipes
                    </span>
                    <span className="text-2xl">📚</span>
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-orange-200 to-transparent"></div>
                  </h2>

                  {savedRecipes.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🍽️</div>
                      <p className="text-xl text-orange-600 font-medium">
                        No saved recipes yet. Start cooking up some magic! ✨
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {savedRecipes.map((recipe, idx) => (
                        <div 
                          key={recipe._id || idx} 
                          className="relative bg-gradient-to-br from-amber-50/80 to-yellow-50/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50 shadow-sm hover:shadow-xl transition-all duration-300 group/card overflow-hidden"
                        >
                          {/* Card pattern overlay */}
                          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22%23f97316%22 fill-opacity=%220.02%22%3E%3Cpath d=%22m0 20l20-20h-20v20zm20 0v-20h-20l20 20z%22/%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
                          
                          <div className="relative z-10">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="font-bold text-amber-700 text-lg group-hover/card:text-amber-800 transition-colors">
                                {recipe.title}
                              </h3>
                              <span className="text-2xl">🍳</span>
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                              <div className="flex items-center gap-1 bg-white/70 px-3 py-1 rounded-full border border-amber-200/50">
                                <span className="text-xs">📋</span>
                                <span className="text-sm font-medium text-amber-700">
                                  {recipe.cookingSteps?.length ? `${recipe.cookingSteps.length} steps` : "No steps"}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 bg-white/70 px-3 py-1 rounded-full border border-amber-200/50">
                                <span className="text-xs">⏱️</span>
                                <span className="text-sm font-medium text-amber-700">
                                  {recipe.estimatedTime ? `${recipe.estimatedTime} min` : "Time N/A"}
                                </span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() => navigate(`/ai-recipe/${recipe._id}`)}
                                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-sm font-semibold py-2 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                              >
                                👁️ View Details
                              </button>
                              <button
                                onClick={() => openConfirmModal(recipe._id, recipe.title)}
                                className="bg-gradient-to-r from-red-400 to-pink-400 hover:from-red-500 hover:to-pink-500 text-white text-sm font-semibold py-2 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Saved Meal Plans Section */}
                <div>
                  <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
                      Your Saved Meal Plans
                    </span>
                    <span className="text-2xl">📅</span>
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-orange-200 to-transparent"></div>
                  </h2>

                  {savedMealPlans.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📋</div>
                      <p className="text-xl text-orange-600 font-medium">
                        No saved meal plans yet. Plan your perfect week! 🗓️
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {savedMealPlans.map((plan, idx) => (
                        <div 
                          key={idx} 
                          className="relative bg-gradient-to-br from-amber-50/80 to-yellow-50/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                          {/* Pattern overlay */}
                          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22%23f97316%22 fill-opacity=%220.02%22%3E%3Cpath d=%22m0 20l20-20h-20v20zm20 0v-20h-20l20 20z%22/%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
                          
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full flex items-center justify-center text-white font-bold">
                                  🥗
                                </div>
                                <div>
                                  <h3 className="font-bold text-amber-700 text-lg">
                                    {plan.diet.charAt(0).toUpperCase() + plan.diet.slice(1)} Meal Plan
                                  </h3>
                                  <p className="text-sm text-amber-600">
                                    Saved on {new Date(plan.createdAt).toLocaleDateString('en-US', { 
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric' 
                                    })} 📅
                                  </p>
                                </div>
                              </div>
                              <div className="bg-white/70 px-3 py-1 rounded-full border border-amber-200/50">
                                <span className="text-sm font-bold text-amber-700">
                                  {plan.plan.length} days
                                </span>
                              </div>
                            </div>

                            <div className="space-y-4">
                              {plan.plan.map(day => (
                                <div key={day.day} className="bg-white/50 rounded-xl p-4 border border-amber-100">
                                  <h4 className="font-bold text-amber-700 mb-3 flex items-center gap-2">
                                    <span className="w-6 h-6 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                      {day.day}
                                    </span>
                                    Day {day.day}
                                  </h4>
                                  
                                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                    {day.meals.map((meal, i) => (
                                      <div key={i} className="bg-gradient-to-br from-yellow-50/70 to-amber-50/70 p-3 rounded-lg border border-yellow-200/50">
                                        <div className="flex items-center justify-between mb-2">
                                          <h5 className="font-semibold text-amber-800 flex items-center gap-1">
                                            <span className="text-sm">
                                              {i === 0 ? '🌅' : i === 1 ? '☀️' : i === 2 ? '🌅' : '🌙'}
                                            </span>
                                            {meal.name}
                                          </h5>
                                          {meal.calories && (
                                            <span className="bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full border border-orange-200">
                                              🔥 {meal.calories}
                                            </span>
                                          )}
                                        </div>
                                        
                                        <div className="space-y-2">
                                          <div>
                                            <p className="text-xs font-semibold text-amber-700 mb-1">🥬 Ingredients:</p>
                                            <div className="flex flex-wrap gap-1">
                                              {meal.ingredients.slice(0, 3).map((ingredient, idx) => (
                                                <span key={idx} className="text-xs bg-white/70 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200/50">
                                                  {ingredient}
                                                </span>
                                              ))}
                                              {meal.ingredients.length > 3 && (
                                                <span className="text-xs bg-white/70 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200/50">
                                                  +{meal.ingredients.length - 3} more
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                          
                                          <div>
                                            <p className="text-xs font-semibold text-amber-700 mb-1">👨‍🍳 Instructions:</p>
                                            <p className="text-xs text-amber-800 bg-white/50 p-2 rounded border border-amber-100 line-clamp-2">
                                              {meal.instructions.length > 100 
                                                ? `${meal.instructions.substring(0, 100)}...` 
                                                : meal.instructions
                                              }
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Logout Button */}
            {!loading && (
              <div className="text-center mt-12 pt-8 border-t border-orange-200/50">
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 via-pink-500 to-red-500 hover:from-red-600 hover:via-pink-600 hover:to-red-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 text-lg flex items-center justify-center gap-3 mx-auto"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(180deg);
          }
        }
        @keyframes slide-in {
          from {
            transform: translateX(100%) translateY(-50px);
            opacity: 0;
          }
          to {
            transform: translateX(0) translateY(0);
            opacity: 1;
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-slide-in {
          animation: slide-in 0.4s ease-out forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}