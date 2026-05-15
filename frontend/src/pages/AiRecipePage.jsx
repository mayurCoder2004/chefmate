import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Utensils, Timer, Users, Heart, ShoppingCart, Package,
  ChefHat, FileText, Bot, ArrowLeft, AlertCircle
} from 'lucide-react';

export default function AiRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [feedbackState, setFeedbackState] = useState({
    selected: null, // 'helpful' | 'not_helpful' | null
    submitted: false
  });

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}/api/recipes/saved`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        const found = data.savedRecipes.find(r => r._id === id);
        if (!found) throw new Error("Recipe not found");
        setRecipe(found);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this recipe?")) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}/api/recipes/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) { navigate("/profile"); }
      else { throw new Error("Failed to delete recipe"); }
    } catch (err) {
      alert("Failed to delete recipe: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handlePrint = () => { window.print(); };

  const handleFeedback = async (rating) => {
    if (feedbackState.submitted || feedbackState.selected) return;

    // Immediately update UI
    setFeedbackState({ selected: rating, submitted: true });

    // Send feedback to backend (fire and forget)
    try {
      await fetch(`${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}/api/feedback/recipe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipeName: recipe.title,
          ingredients: recipe.usedIngredients || [],
          rating,
          timestamp: new Date()
        })
      });
    } catch (err) {
      // Silently fail - user already sees success message
      console.error("Failed to submit feedback:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 mt-20">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-md">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-orange-200 border-t-orange-500 mb-4" />
            <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
              <Utensils size={16} className="text-orange-500" /> Loading your recipe...
            </p>
            <div className="mt-6 space-y-3 text-left">
              <div className="h-6 w-3/4 bg-gray-100 rounded-lg animate-pulse" />
              <div className="h-4 w-1/2 bg-gray-100 rounded-lg animate-pulse" />
              <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
              <div className="h-20 bg-gray-100 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 mt-20 flex items-center justify-center">
        <div className="max-w-sm w-full bg-white border border-gray-200 rounded-xl p-8 text-center shadow-md">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-sm text-red-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 bg-orange-500 text-white rounded-lg font-medium text-sm hover:bg-orange-600 transition duration-200 hover:scale-[1.02] flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={18} /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 mt-20">
      <div className="max-w-3xl mx-auto space-y-4">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition duration-200 flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Back to Recipes
        </button>

        {/* Recipe content */}
        <div className="bg-white border border-orange-100 rounded-xl p-5 space-y-5 shadow-md hover:shadow-lg transition duration-200">

          {/* Header */}
          <div className="text-center pb-4 border-b border-gray-100">
            <h1 className="text-xl font-semibold text-gray-800 mb-3 flex items-center justify-center gap-2">
              <Utensils size={20} className="text-orange-500" />
              {recipe.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-lg text-sm">
                <Timer size={14} className="text-orange-600" />
                <span className="text-orange-700 font-medium">{recipe.estimatedTime} min</span>
              </div>
              {recipe.servings && (
                <div className="flex items-center gap-1.5 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-lg text-sm">
                  <Users size={14} className="text-gray-600" />
                  <span className="text-gray-700 font-medium">{recipe.servings} servings</span>
                </div>
              )}
            </div>
          </div>

          {/* Health Benefits */}
          {recipe.healthBenefits && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-sm font-medium text-green-800 mb-1 flex items-center gap-2">
                <Heart size={16} className="text-green-600" /> Health Benefits
              </h3>
              <p className="text-sm text-green-700 leading-relaxed">
                {Array.isArray(recipe.healthBenefits) ? recipe.healthBenefits.join(', ') : recipe.healthBenefits}
              </p>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-4">
            {/* Ingredients */}
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <ShoppingCart size={18} className="text-orange-500" /> Main Ingredients
                </h3>
                <ul className="space-y-1.5">
                  {recipe.usedIngredients.map((ingredient, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 bg-orange-400 rounded-full flex-shrink-0" />
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>

              {recipe.optionalIngredients?.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Package size={18} className="text-orange-500" /> Optional / Pantry Items
                  </h3>
                  <ul className="space-y-1.5">
                    {recipe.optionalIngredients.map((ingredient, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full flex-shrink-0" />
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center gap-2">
                <ChefHat size={18} className="text-orange-500" /> Cooking Instructions
              </h3>
              {recipe.cookingSteps?.length > 0 ? (
                <ol className="space-y-3">
                  {recipe.cookingSteps.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center font-medium text-xs">
                        {i + 1}
                      </span>
                      <span className="text-sm text-gray-600 leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-gray-400 italic">No cooking steps available.</p>
              )}

              {recipe.notes && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FileText size={16} className="text-gray-400" /> Chef's Notes
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{recipe.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400 flex items-center justify-center gap-1.5">
              <Bot size={14} /> Recipe created by AI Chef · Saved on {new Date(recipe.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>

          {/* Feedback Section */}
          <div className="pt-4 border-t border-gray-100">
            {!feedbackState.submitted ? (
              <div className="flex items-center justify-center gap-3">
                <span className="text-sm text-gray-600">Was this recipe helpful?</span>
                <button
                  onClick={() => handleFeedback('helpful')}
                  className="text-2xl hover:scale-110 transition-transform duration-200 focus:outline-none"
                  aria-label="Helpful"
                  style={{
                    filter: feedbackState.selected === 'helpful' ? 'none' : 'grayscale(0.3)',
                    opacity: feedbackState.selected === 'helpful' ? 1 : 0.7
                  }}
                >
                  👍
                </button>
                <button
                  onClick={() => handleFeedback('not_helpful')}
                  className="text-2xl hover:scale-110 transition-transform duration-200 focus:outline-none"
                  aria-label="Not helpful"
                  style={{
                    filter: feedbackState.selected === 'not_helpful' ? 'none' : 'grayscale(0.3)',
                    opacity: feedbackState.selected === 'not_helpful' ? 1 : 0.7
                  }}
                >
                  👎
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
                  Thanks for your feedback! 🙏
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .fixed, button { display: none !important; }
        }
      `}</style>
    </div>
  );
}