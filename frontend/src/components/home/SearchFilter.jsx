import { useState, useEffect } from "react";
import RecipeCard from "../RecipeCard";
import { filterMealsByCategory, searchMeals, filterMealsByRegion } from "../../services/mealdb";
import { ChefHat, Search } from "lucide-react";

export default function SearchFilter() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [region, setRegion] = useState("all");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      let data;

      if (search) {
        data = await searchMeals(search);
      } else if (category !== "all") {
        data = await filterMealsByCategory(category);
      } else if (region !== "all") {
        data = await filterMealsByRegion(region);
      } else {
        data = { meals: [] };
      }

      setRecipes(data.meals || []);
      setLoading(false);
    };

    fetchRecipes();
  }, [search, category, region]);

  return (
    <div className="space-y-5">
      {/* Search + Filter controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search recipes..."
            className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none transition-all sm:w-40"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="Beef">Beef</option>
          <option value="Chicken">Chicken</option>
          <option value="Dessert">Dessert</option>
          <option value="Seafood">Seafood</option>
        </select>

        <select
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none transition-all sm:w-40"
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
        </select>
      </div>

      {/* Recipe List */}
      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-7 w-7 border-4 border-orange-200 border-t-orange-500 mb-2" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {recipes.length > 0 ? (
            recipes.map((recipe) => (
              <RecipeCard key={recipe.idMeal} recipe={recipe} />
            ))
          ) : (
            <p className="col-span-full text-center text-sm text-gray-500 flex items-center justify-center gap-2 py-10">
              <ChefHat size={18} className="text-orange-400" /> No recipes found
            </p>
          )}
        </div>
      )}
    </div>
  );
}
