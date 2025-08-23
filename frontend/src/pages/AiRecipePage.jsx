import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function AiRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

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
      
      if (res.ok) {
        navigate("/profile");
      } else {
        throw new Error("Failed to delete recipe");
      }
    } catch (err) {
      alert("Failed to delete recipe: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-8 px-4 mt-20">
        {/* Background decorative elements */}
        <div className="fixed top-0 left-0 w-80 h-80 bg-gradient-to-br from-orange-300/10 to-amber-300/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="fixed bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-yellow-300/10 to-orange-300/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-orange-200/50 space-y-4">
            <div className="text-center mb-6">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-500 mb-4"></div>
              <p className="text-xl text-orange-700 font-semibold">
                🍽️ Loading your delicious recipe...
              </p>
            </div>
            <div className="space-y-3">
              <div className="h-8 w-3/4 bg-gradient-to-r from-orange-200/50 to-amber-200/50 rounded-full animate-pulse"></div>
              <div className="h-6 w-1/2 bg-gradient-to-r from-amber-200/50 to-yellow-200/50 rounded-full animate-pulse"></div>
              <div className="h-32 bg-gradient-to-br from-orange-100/50 to-amber-100/50 rounded-2xl animate-pulse"></div>
              <div className="h-24 bg-gradient-to-br from-yellow-100/50 to-orange-100/50 rounded-2xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-8 px-4 mt-20 flex items-center justify-center">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-orange-200/50 text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h2>
          <p className="text-red-700 mb-6 font-medium">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

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
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-gray-100/80 to-gray-200/80 hover:from-gray-200/80 hover:to-gray-300/80 text-gray-700 font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            ← Back to Recipes
          </button>
        </div>

        {/* Recipe Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-orange-200/50 space-y-6 group hover:shadow-3xl transition-all duration-500 overflow-hidden">
          {/* Pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22%23f97316%22 fill-opacity=%220.02%22%3E%3Cpath d=%22m0 40l40-40h-40v40zm40 0v-40h-40l40 40z%22/%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
          
          <div className="relative z-10">
            {/* Recipe Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">
                <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
                  {recipe.title}
                </span>
                <span className="text-3xl ml-2 inline-block animate-bounce">🍽️</span>
              </h1>
              
              <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
                <div className="flex items-center gap-2 bg-gradient-to-r from-orange-100/80 to-amber-100/80 backdrop-blur-sm border border-orange-200/50 px-4 py-2 rounded-full shadow-sm">
                  <span className="text-orange-700 font-bold">⏱️ {recipe.estimatedTime} min</span>
                </div>
                {recipe.servings && (
                  <div className="flex items-center gap-2 bg-gradient-to-r from-amber-100/80 to-yellow-100/80 backdrop-blur-sm border border-amber-200/50 px-4 py-2 rounded-full shadow-sm">
                    <span className="text-amber-700 font-bold">👥 {recipe.servings} servings</span>
                  </div>
                )}
              </div>
            </div>

            {/* Health Benefits */}
            {recipe.healthBenefits && (
              <div className="mb-8 p-6 bg-gradient-to-r from-green-50/80 to-emerald-50/80 backdrop-blur-sm border-2 border-green-200/50 rounded-2xl">
                <h3 className="text-xl font-bold text-green-700 mb-3 flex items-center gap-2">
                  💚 Health Benefits
                </h3>
                <p className="text-green-800 font-medium leading-relaxed">
                  {Array.isArray(recipe.healthBenefits) ? recipe.healthBenefits.join(', ') : recipe.healthBenefits}
                </p>
              </div>
            )}

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Ingredients Section */}
              <div className="space-y-6">
                {/* Used Ingredients */}
                <div className="bg-gradient-to-br from-orange-50/80 to-amber-50/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-200/50">
                  <h3 className="text-2xl font-bold text-orange-700 mb-4 flex items-center gap-2">
                    🥬 Main Ingredients
                  </h3>
                  <ul className="space-y-3">
                    {recipe.usedIngredients.map((ingredient, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-700 font-medium bg-white/50 rounded-xl px-3 py-2 border border-orange-100">
                        <span className="w-2 h-2 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full flex-shrink-0"></span>
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Optional Ingredients */}
                {recipe.optionalIngredients?.length > 0 && (
                  <div className="bg-gradient-to-br from-amber-50/80 to-yellow-50/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50">
                    <h3 className="text-2xl font-bold text-amber-700 mb-4 flex items-center gap-2">
                      🧂 Optional / Pantry Items
                    </h3>
                    <ul className="space-y-3">
                      {recipe.optionalIngredients.map((ingredient, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-700 font-medium bg-white/50 rounded-xl px-3 py-2 border border-amber-100">
                          <span className="w-2 h-2 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full flex-shrink-0"></span>
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Instructions Section */}
              <div className="bg-gradient-to-br from-yellow-50/80 to-orange-50/80 backdrop-blur-sm rounded-2xl p-6 border border-yellow-200/50">
                <h3 className="text-2xl font-bold text-yellow-700 mb-6 flex items-center gap-2">
                  👨‍🍳 Cooking Instructions
                </h3>
                {recipe.cookingSteps?.length > 0 ? (
                  <ol className="space-y-4">
                    {recipe.cookingSteps.map((step, i) => (
                      <li key={i} className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {i + 1}
                        </span>
                        <div className="bg-white/50 rounded-xl px-4 py-3 border border-yellow-100 flex-1">
                          <span className="text-gray-700 font-medium leading-relaxed">{step}</span>
                        </div>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-yellow-700 italic">No cooking steps available.</p>
                )}
                
                {/* Recipe Notes */}
                {recipe.notes && (
                  <div className="mt-6 pt-6 border-t border-yellow-200/50">
                    <h4 className="text-lg font-bold text-yellow-700 mb-3 flex items-center gap-2">
                      📝 Chef's Notes
                    </h4>
                    <div className="bg-white/50 rounded-xl px-4 py-3 border border-yellow-100">
                      <p className="text-yellow-800 font-medium leading-relaxed">{recipe.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recipe Footer */}
            <div className="mt-8 pt-6 border-t border-orange-200/50 text-center">
              <p className="text-orange-600/80 font-medium text-sm">
                🤖 Recipe created by AI Chef • Saved on {new Date(recipe.createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Styles */}
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
        
        @media print {
          .fixed, button {
            display: none !important;
          }
          .bg-gradient-to-br {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
}