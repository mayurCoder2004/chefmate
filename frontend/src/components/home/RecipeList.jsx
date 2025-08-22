import { useEffect, useState } from "react";
import { getRandomMeals } from "../../services/mealdb";
import RecipeCard from "../RecipeCard";

export default function RecipeList() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    async function fetchRecipes() {
      const results = [];
      for (let i = 0; i < 3; i++) {   // fetch 3 random meals
        const data = await getRandomMeals();
        if (data.meals && data.meals.length > 0) {
          results.push(data.meals[0]);
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
