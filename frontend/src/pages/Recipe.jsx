import { useEffect, useState } from "react";
import { searchMeals } from "../services/mealdb";
import SidebarFilters from "../components/SidebarFilters";
import RecipeCard from "../components/RecipeCard";

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch some random meals initially
  useEffect(() => {
    async function fetchRandomMeals() {
      setLoading(true);
      const results = [];
      for (let i = 0; i < 6; i++) {
        const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
        const data = await res.json();
        if (data.meals && data.meals.length > 0) {
          results.push(data.meals[0]);
        }
      }
      setRecipes(results);
      setLoading(false);
    }

    fetchRandomMeals();
  }, []);

  // Handle search/filter from Sidebar
  const handleSearch = async ({ query, category, area }) => {
    setLoading(true);
    setHasSearched(true);

    try {
      let data;
      if (query) {
        data = await searchMeals(query); // Search by query
      } else {
        data = { meals: [] }; // No query, empty result
      }

      // Optional: filter by category/area if provided
      let filtered = data.meals || [];
      if (category) {
        filtered = filtered.filter((meal) =>
          meal.strCategory?.toLowerCase().includes(category.toLowerCase())
        );
      }
      if (area) {
        filtered = filtered.filter((meal) =>
          meal.strArea?.toLowerCase().includes(area.toLowerCase())
        );
      }

      setRecipes(filtered);
    } catch (err) {
      console.error(err);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 flex gap-6">
      {/* Sidebar */}
      <div className="w-1/4 sticky top-6 self-start h-fit">
        <SidebarFilters onSearch={handleSearch} />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-center mb-8">Recipes</h1>

        {loading ? (
          <p className="text-center mt-10">Loading recipes...</p>
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.idMeal} recipe={recipe} />
            ))}
          </div>
        ) : (
          hasSearched && <p className="text-center mt-10">No recipes found.</p>
        )}
      </div>
    </div>
  );
}
