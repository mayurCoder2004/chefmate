import { useEffect, useState } from "react";
import { getRandomMeals } from "../../services/mealdb";
import RecipeCard from "../RecipeCard";

export default function RecipeList() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    async function fetchRecipes() {
      const results = [];
      let attempts = 0;

      while (results.length < 3 && attempts < 20) {
        const data = await getRandomMeals();
        attempts++;

        if (data.meals && data.meals.length > 0) {
          const meal = data.meals[0];
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
    <section className="py-12 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">Featured Recipes</h2>
          <p className="text-sm text-gray-600">Handpicked culinary delights from around the world.</p>
        </div>

        {recipes.length === 0 ? (
          <div className="text-center py-16 bg-orange-50 border border-orange-100 rounded-lg">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-200 border-t-orange-500 mb-3" />
            <p className="text-sm font-medium text-orange-600">Loading recipes...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map((meal) => (
              <RecipeCard key={meal.idMeal} recipe={meal} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
