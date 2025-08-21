import { useEffect, useState } from "react";
import { getRandomMeals } from "../../services/mealdb";
import { Link } from "react-router-dom";

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
          <div key={meal.idMeal} className="bg-white shadow-md rounded-lg p-4">
            <img
              src={meal.strMealThumb}
              alt={meal.strMeal}
              className="rounded-lg w-full h-48 object-cover"
            />
            <h3 className="text-lg font-semibold mt-2">{meal.strMeal}</h3>
            <p className="text-sm text-gray-600">
              {meal.strArea} • {meal.strCategory}
            </p>
            {/* ✅ Internal navigation to RecipePage */}
            <Link
              to={`/recipe/${meal.idMeal}`}
              className="text-primary font-medium mt-2 inline-block hover:underline"
            >
              View Recipe
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
