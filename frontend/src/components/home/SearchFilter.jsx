import { useState, useEffect } from "react";
import RecipeCard from "../RecipeCard";
import { filterMealsByCategory, searchMeals, filterMealsByRegion } from "../../services/mealdb";

export default function SearchFilter() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [region, setRegion] = useState("all");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch recipes whenever search, category or region changes
  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      let data;

      if (search) {
        data = await searchMeals(search); // search API
      } else if (category !== "all") {
        data = await filterMealsByCategory(category); // category API
      } else if (region !== "all") {
        data = await filterMealsByRegion(region); // region API
      } else {
        data = { meals: [] }; // default empty
      }

      setRecipes(data.meals || []);
      setLoading(false);
    };

    fetchRecipes();
  }, [search, category, region]);

  return (
    <div>
      {/* Search + Filter controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <input
          type="text"
          placeholder="Search recipes..."
          className="border rounded-lg px-4 py-2 w-full sm:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Category Filter */}
        <select
          className="border rounded-lg px-4 py-2 w-full sm:w-1/4"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="Beef">Beef</option>
          <option value="Chicken">Chicken</option>
          <option value="Dessert">Dessert</option>
          <option value="Seafood">Seafood</option>
        </select>

        {/* Region Filter */}
        <select
          className="border rounded-lg px-4 py-2 w-full sm:w-1/4"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          <option value="all">All Regions</option>
          <option value="American">American</option>
          <option value="British">British</option>
          <option value="Canadian">Canadian</option>
          <option value="Chinese">Chinese</option>
          <option value="Indian">Indian</option>
          <option value="Italian">Italian</option>
          <option value="Mexican">Mexican</option>
          <option value="Thai">Thai</option>
          {/* add more if needed */}
        </select>
      </div>

      {/* Recipe List */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recipes.length > 0 ? (
            recipes.map((recipe) => (
              <RecipeCard key={recipe.idMeal} recipe={recipe} />
            ))
          ) : (
            <p className="text-center text-gray-500">No recipes found 🍳</p>
          )}
        </div>
      )}
    </div>
  );
}
