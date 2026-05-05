import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChefHat, Timer, Heart, ShoppingCart, Package, Users, FileText, Utensils, XCircle, Loader
} from 'lucide-react';

export default function SharedRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSharedRecipe() {
      try {
        const res = await fetch(
          `${import.meta.env?.VITE_BASE_URL || 'http://localhost:5000'}/api/share-recipe/${id}`
        );
        
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Recipe not found');
          }
          throw new Error('Failed to load recipe');
        }
        
        const data = await res.json();
        setRecipe(data);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }

    fetchSharedRecipe();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="text-center">
          <Loader className="inline-block animate-spin h-8 w-8 text-orange-500 mb-4" />
          <p className="text-gray-600 font-medium">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-xl p-8 text-center shadow-lg">
          <XCircle className="inline-block h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition duration-200"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20 pt-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <ChefHat size={18} />
            Shared Recipe
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{recipe.title}</h1>
          <p className="text-gray-600">Someone shared this delicious recipe with you!</p>
        </div>

        {/* Recipe Card */}
        <div className="bg-white border border-orange-100 rounded-xl p-6 space-y-6 shadow-md">
          {/* Time Badge */}
          <div className="flex items-center justify-center gap-2 bg-orange-50 border border-orange-200 px-4 py-2 rounded-lg w-fit mx-auto">
            <Timer size={18} className="text-orange-600" />
            <span className="text-orange-700 font-medium">{recipe.estimatedTime} min</span>
          </div>

          {/* Health Benefits */}
          {recipe.healthBenefits?.length > 0 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm flex items-start gap-2">
                <Heart size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Why it's healthy:</strong> {recipe.healthBenefits.join(', ')}
                </span>
              </p>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Ingredients Section */}
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <ShoppingCart size={20} className="text-orange-500" /> Used Ingredients
                </h3>
                <ul className="space-y-2">
                  {recipe.usedIngredients?.map((ingredient, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0" />
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>

              {recipe.optionalIngredients?.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <Package size={20} className="text-orange-500" /> Optional / Pantry
                  </h3>
                  <ul className="space-y-2">
                    {recipe.optionalIngredients.map((ingredient, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="w-2 h-2 bg-gray-300 rounded-full flex-shrink-0" />
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Cooking Steps Section */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <ChefHat size={20} className="text-orange-500" /> Cooking Steps
              </h3>
              <ol className="space-y-4">
                {recipe.cookingSteps?.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex-shrink-0 w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-600 leading-relaxed pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>

              {/* Additional Info */}
              <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
                {recipe.servings && (
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Users size={16} className="text-orange-500" />
                    <strong>Servings:</strong> {recipe.servings}
                  </p>
                )}
                {recipe.notes && !recipe.notes.toLowerCase().includes('fallback') && (
                  <p className="text-sm text-gray-600 flex items-start gap-2">
                    <FileText size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>{recipe.notes}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="pt-6 border-t border-gray-100 text-center space-y-4">
            <p className="text-gray-700 font-medium">Want to create your own AI-powered recipes?</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/signup')}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition duration-200 flex items-center justify-center gap-2"
              >
                <ChefHat size={18} />
                Get Started
              </button>
              <button
                onClick={() => navigate('/app')}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition duration-200 flex items-center justify-center gap-2"
              >
                <Utensils size={18} />
                Try Smart Recipe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
