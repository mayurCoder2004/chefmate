import { useEffect, useState } from "react";
import { getRandomMeals } from "../../services/mealdb";
import RecipeCard from "../RecipeCard";

export default function RecipeList() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    async function fetchRecipes() {
      const results = [];
      let attempts = 0;

      // Fetch until we get 3 valid meals (excluding Beef & Pork)
      while (results.length < 3 && attempts < 20) {
        const data = await getRandomMeals();
        attempts++;

        if (data.meals && data.meals.length > 0) {
          const meal = data.meals[0];

          // Exclude Beef and Pork categories
          if (
            meal.strCategory &&
            meal.strCategory.toLowerCase() !== "beef" &&
            meal.strCategory.toLowerCase() !== "pork"
          ) {
            results.push(meal);
          }
        }
      }

      setRecipes(results);
    }
    fetchRecipes();
  }, []);

  return (
    <section className="py-16 px-6 bg-gradient-to-br from-gray-50 via-orange-50/30 to-amber-50/20 min-h-screen relative overflow-hidden">
      {/* Background decoration (fixed quotes with %22) */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23f97316%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-12 group">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-orange-400 group-hover:to-orange-500 transition-colors duration-500"></div>
            <svg
              className="w-8 h-8 text-orange-500 group-hover:text-orange-600 transition-all duration-300 group-hover:scale-110"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-orange-400 group-hover:to-orange-500 transition-colors duration-500"></div>
          </div>

          <h2 className="text-4xl font-bold text-gray-900 mb-4 group-hover:text-orange-700 transition-colors duration-300 tracking-tight">
            Featured Recipes
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover handpicked culinary delights from around the world,
            carefully curated for your next cooking adventure
          </p>

          <div className="mt-6 flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400 rounded-full group-hover:w-32 transition-all duration-500"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {recipes.map((meal, index) => (
            <div
              key={meal.idMeal}
              className="transform transition-all duration-300 hover:scale-[1.02]"
              style={{
                animationDelay: `${index * 150}ms`,
                animation: `fadeInUp 0.6s ease-out forwards`,
              }}
            >
              <RecipeCard recipe={meal} />
            </div>
          ))}
        </div>

        {recipes.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-orange-500 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <p className="text-gray-600 text-lg">Loading delicious recipes...</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
