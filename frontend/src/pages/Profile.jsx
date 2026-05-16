import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  ChefHat, Sparkles, BookOpen, Calendar, ClipboardList, Utensils,
  Timer, Salad, Sunrise, Sun, Moon, Flame, Leaf, LogOut,
  Eye, Trash2, CheckCircle2, XCircle, Info, Search
} from 'lucide-react';

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

  const IconComp = type === 'success' ? CheckCircle2 : type === 'error' ? XCircle : Info;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${bgColor} text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-sm max-w-sm`}>
        <div className="flex items-center gap-3">
          <IconComp size={20} className="flex-shrink-0" />
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
          <div className="flex justify-center mb-4"><Trash2 size={56} className="text-red-400" /></div>
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
            <Trash2 size={16} /> Delete
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
      showToast(`"${confirmModal.recipeName}" has been removed from your saved recipes!`, 'success');
      closeConfirmModal();
    } catch (err) {
      showToast(err.message, 'error');
      closeConfirmModal();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 mt-20">
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

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <ChefHat size={32} className="text-orange-600" />
            My Profile
          </h1>
          <p className="text-lg text-gray-600">Welcome back, {user?.name}!</p>
        </div>

        {/* Main Content Container */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-200 space-y-6">
            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-orange-200 border-t-orange-500 mb-4"></div>
                <p className="text-lg font-medium text-orange-600 flex items-center justify-center gap-2">
                  <Search size={18} /> Loading your culinary collection...
                </p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 font-medium flex items-center gap-2 text-center justify-center">
                  <XCircle size={16} /> {error}
                </p>
              </div>
            )}

            {/* Saved Recipes Section */}
            {loading && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <BookOpen size={22} className="text-orange-600" />
                    Your Saved Recipes
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
                        <div className="skeleton-line h-4 w-3/4"></div>
                        <div className="skeleton-line h-3 w-1/2"></div>
                        <div className="skeleton-line h-3 w-2/3"></div>
                        <div className="skeleton-line h-9 w-full mt-2" style={{borderRadius: '10px'}}></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!loading && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <BookOpen size={22} className="text-orange-600" />
                    Your Saved Recipes
                  </h2>

                  {savedRecipes.length === 0 ? (
                    <div className="text-center py-12 bg-orange-50 border border-orange-100 rounded-lg">
                      <Utensils size={48} className="text-orange-400 mx-auto mb-3" />
                      <p className="text-lg font-medium text-orange-600">
                        No saved recipes yet. Start cooking up some magic!
                      </p>
                    </div>
                  ) : (
                    <div className="recipe-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {savedRecipes.map((recipe, idx) => (
                        <div 
                          key={recipe._id || idx} 
                          className="bg-white border border-orange-100 rounded-xl p-4 shadow-sm hover:shadow-md transition duration-200 hover:scale-[1.01]"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-semibold text-gray-800 text-base">
                              {recipe.title}
                            </h3>
                            <ChefHat size={20} className="text-orange-600 flex-shrink-0" />
                          </div>

                          <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 px-2 py-1 rounded-lg">
                              <ClipboardList size={12} className="text-gray-600" />
                              <span className="text-xs font-medium text-gray-700">
                                {recipe.cookingSteps?.length ? `${recipe.cookingSteps.length} steps` : "No steps"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 px-2 py-1 rounded-lg">
                              <Timer size={12} className="text-gray-600" />
                              <span className="text-xs font-medium text-gray-700">
                                {recipe.estimatedTime ? `${recipe.estimatedTime} min` : "Time N/A"}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate(`/ai-recipe/${recipe._id}`)}
                              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition duration-200 hover:scale-[1.02] flex items-center justify-center gap-1.5"
                            >
                              <Eye size={14} /> View
                            </button>
                            <button
                              onClick={() => openConfirmModal(recipe._id, recipe.title)}
                              className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition duration-200 hover:scale-[1.02] flex items-center justify-center"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Saved Meal Plans Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Calendar size={22} className="text-orange-600" />
                    Your Saved Meal Plans
                  </h2>

                  {savedMealPlans.length === 0 ? (
                    <div className="text-center py-12 bg-orange-50 border border-orange-100 rounded-lg">
                      <ClipboardList size={48} className="text-orange-400 mx-auto mb-3" />
                      <p className="text-lg font-medium text-orange-600">
                        No saved meal plans yet. Plan your perfect week!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {savedMealPlans.map((plan, idx) => (
                        <div 
                          key={idx} 
                          className="bg-white border border-orange-100 rounded-xl p-5 shadow-sm hover:shadow-md transition"
                        >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full flex items-center justify-center text-white font-bold">
                                  <Salad size={20} />
                                </div>
                                <div>
                                  <h3 className="font-bold text-amber-700 text-lg">
                                    {plan.diet.charAt(0).toUpperCase() + plan.diet.slice(1)} Meal Plan
                                  </h3>
                                  <p className="text-sm text-amber-600 flex items-center gap-1">
                                    <Calendar size={12} /> Saved on {new Date(plan.createdAt).toLocaleDateString('en-US', { 
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric' 
                                    })}
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
                                              {i === 0 ? <Sunrise size={14} className="text-amber-500" /> : i === 1 ? <Sun size={14} className="text-yellow-500" /> : i === 2 ? <Sunrise size={14} className="text-orange-400" /> : <Moon size={14} className="text-indigo-400" />}
                                            </span>
                                            {meal.name}
                                          </h5>
                                          {meal.calories && (
                                            <span className="bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full border border-orange-200 flex items-center gap-1">
                                              <Flame size={10} /> {meal.calories}
                                            </span>
                                          )}
                                        </div>
                                        
                                        <div className="space-y-2">
                                          <div>
                                            <p className="text-xs font-semibold text-amber-700 mb-1 flex items-center gap-1"><Leaf size={11} /> Ingredients:</p>
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
                                            <p className="text-xs font-semibold text-amber-700 mb-1 flex items-center gap-1"><ChefHat size={11} /> Instructions:</p>
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
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Logout Button */}
            {!loading && (
              <div className="text-center mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="px-5 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition duration-200 hover:scale-[1.02] flex items-center justify-center gap-2 mx-auto"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            )}
        </div>
      </div>

      <style jsx>{`
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