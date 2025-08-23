import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function RecipePage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
      .then((res) => res.json())
      .then((data) => setRecipe(data.meals[0]));
  }, [id]);

  const handleSaveRecipe = async () => {
    if (!recipe) return;
    setSaving(true);

    try {
      const token = localStorage.getItem("token");

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
        `${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}/api/recipes/save`,
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

      toast.success("Recipe saved successfully 🎉");
    } catch (err) {
      toast.error(err.message || "Something went wrong!");
    } finally {
      setSaving(false);
    }
  };

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-xl text-orange-700 font-semibold">
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
        {/* Header Section */}
        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-2xl border border-orange-200/50 overflow-hidden group hover:shadow-3xl transition-all duration-500">
          {/* Pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22%23f97316%22 fill-opacity=%220.03%22%3E%3Cpath d=%22m0 40l40-40h-40v40zm40 0v-40h-40l40 40z%22/%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

          <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start">
            {/* Image Section */}
            <div className="lg:w-1/2 group/image">
              <div className="relative transform transition-all duration-500 group-hover:scale-105">
                {/* Image glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-400 rounded-3xl blur-2xl opacity-0 group-hover/image:opacity-20 transition-opacity duration-500"></div>

                <img
                  src={recipe.strMealThumb}
                  alt={recipe.strMeal}
                  className="relative w-full rounded-3xl shadow-2xl border-2 border-orange-200/50 object-cover transform transition-all duration-500 group-hover/image:shadow-3xl group-hover/image:border-orange-300/70"
                />

                {/* Decorative frame elements */}
                <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-orange-400 rounded-tl-lg opacity-0 group-hover/image:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-orange-400 rounded-tr-lg opacity-0 group-hover/image:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-orange-400 rounded-bl-lg opacity-0 group-hover/image:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-orange-400 rounded-br-lg opacity-0 group-hover/image:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>

            {/* Title and Details */}
            <div className="lg:w-1/2 space-y-6">
              <h1 className="text-4xl lg:text-5xl font-extrabold drop-shadow-lg leading-tight">
                <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
                  {recipe.strMeal}
                </span>
                <span className="text-3xl ml-2 inline-block animate-bounce">
                  🍽️
                </span>
              </h1>

              {/* Tags */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-orange-100/80 backdrop-blur-sm text-orange-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm border border-orange-200/50">
                  {recipe.strCategory}
                </div>
                <div className="flex items-center gap-2 bg-amber-100/80 backdrop-blur-sm text-amber-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm border border-amber-200/50">
                  {recipe.strArea}
                </div>
                <div className="flex items-center gap-2 bg-yellow-100/80 backdrop-blur-sm text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm border border-yellow-200/50">
                  {ingredients.length * 5} min
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveRecipe}
                disabled={saving}
                className={`group/btn relative bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden ${
                  saving ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <span className="relative z-10 flex items-center gap-3">
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Saving Recipe...
                    </>
                  ) : (
                    <>
                      Save Recipe ✅
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Ingredients & Instructions */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Ingredients Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold mb-6 text-orange-600">
              Ingredients
            </h2>
            <ul className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <li key={index}>
                  <span className="font-semibold">{ingredient}</span>{" "}
                  {recipe[`strMeasure${index + 1}`] && (
                    <span>- {recipe[`strMeasure${index + 1}`]}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold mb-6 text-amber-600">
              Instructions
            </h2>
            <p className="text-gray-700 whitespace-pre-line">
              {recipe.strInstructions}
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
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
