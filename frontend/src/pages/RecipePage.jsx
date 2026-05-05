import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../contexts/AuthContext";
import { Utensils, Bookmark } from 'lucide-react';

export default function RecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [saving, setSaving] = useState(false);
  const { user, token } = useContext(AuthContext); // get auth state

  useEffect(() => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
      .then((res) => res.json())
      .then((data) => setRecipe(data.meals[0]));
  }, [id]);

  const handleSaveRecipe = async () => {
    if (!recipe) return;

    if (!token) {
      toast.error("Please log in to save recipes.");
      setTimeout(() => navigate("/login"), 1500); // redirect after 1.5s
      return;
    }

    setSaving(true);

    try {
      const ingredients = Array.from(
        { length: 20 },
        (_, i) => recipe[`strIngredient${i + 1}`]
      ).filter(Boolean);

      const mappedRecipe = {
        title: recipe.strMeal,
        usedIngredients: ingredients,
        optionalIngredients: [],
        cookingSteps: recipe.strInstructions
          ? recipe.strInstructions.split(/\r?\n/)
          : [],
        estimatedTime: ingredients.length * 5, // heuristic: 5 min per ingredient
        servings: 2, // default
        notes: "",
        healthBenefits: "",
      };

      const res = await fetch(
        `${
          import.meta.env.VITE_BASE_URL || "http://localhost:5000"
        }/api/recipes/save`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(mappedRecipe),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save recipe");

      toast.success("Recipe saved successfully", { icon: <Bookmark size={18} /> });
    } catch (err) {
      toast.error(err.message || "Something went wrong!");
    } finally {
      setSaving(false);
    }
  };

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-orange-50 border border-orange-100 p-6 rounded-lg text-center max-w-sm">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-lg font-medium text-orange-600">
            Loading delicious recipe...
          </p>
        </div>
      </div>
    );
  }

  const ingredients = Array.from(
    { length: 20 },
    (_, i) => recipe[`strIngredient${i + 1}`]
  ).filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 mt-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white border border-orange-100 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-200">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Image Section */}
            <div className="lg:w-1/2">
              <img
                src={recipe.strMealThumb}
                alt={recipe.strMeal}
                className="w-full rounded-xl shadow-sm object-cover"
              />
            </div>

            {/* Title and Details */}
            <div className="lg:w-1/2 space-y-5">
              <h1 className="text-3xl lg:text-4xl font-semibold text-gray-800 leading-tight flex items-center gap-2">
                {recipe.strMeal}
                <Utensils size={28} className="text-orange-600" />
              </h1>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <div className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-2 rounded-lg text-sm font-medium">
                  {recipe.strCategory}
                </div>
                <div className="bg-gray-100 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">
                  {recipe.strArea}
                </div>
                <div className="bg-gray-100 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">
                  {ingredients.length * 5} min
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveRecipe}
                disabled={saving}
                className={`px-5 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition duration-200 hover:scale-[1.02] flex items-center gap-2 ${
                  saving ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving Recipe...
                  </>
                ) : (
                  <>
                    <Bookmark size={18} /> Save Recipe
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Ingredients & Instructions */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Ingredients Section */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition duration-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Ingredients
            </h2>
            <ul className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <li key={index} className="text-gray-700">
                  <span className="font-medium text-orange-600">{ingredient}</span>{" "}
                  {recipe[`strMeasure${index + 1}`] && (
                    <span className="text-gray-600">- {recipe[`strMeasure${index + 1}`]}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions Section */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition duration-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Instructions
            </h2>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {recipe.strInstructions}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
