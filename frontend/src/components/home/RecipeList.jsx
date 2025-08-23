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
    <section className="py-10 px-6 bg-gray-50">
      <h2 className="text-2xl font-bold text-center mb-6">Featured Recipes</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recipes.map((meal) => (
          <RecipeCard key={meal.idMeal} recipe={meal} />
        ))}
      </div>
    </section>
  );
}
