import { useEffect, useState } from "react";
import { ChefHat } from "lucide-react";
import { searchMeals } from "../services/mealdb";
import SidebarFilters from "../components/SidebarFilters";
import RecipeCard from "../components/RecipeCard";

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch some random meals initially (excluding Beef and Pork)
  useEffect(() => {
    async function fetchRandomMeals() {
      setLoading(true);
      const results = [];
      let attempts = 0;

      while (results.length < 20 && attempts < 50) {
        const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
        const data = await res.json();
        attempts++;

        if (data.meals && data.meals.length > 0) {
          const meal = data.meals[0];

          // Exclude Beef and Pork
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

      // Filter by category/area if provided
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white relative overflow-hidden pt-24 pb-12">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23f97316\' fill-opacity=\'0.02\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>

      <div className="p-6 lg:p-8 flex gap-8 relative z-10 max-w-7xl mx-auto">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4 sticky top-24 self-start h-fit">
          <div className="transform transition-all duration-200 hover:scale-[1.01]">
            <SidebarFilters onSearch={handleSearch} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full lg:w-3/4">
          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-orange-400"></div>
              <ChefHat size={28} className="text-orange-500" />
              <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-orange-400"></div>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-3 tracking-tight">
              Discover <span className="text-orange-600">Amazing Recipes</span>
            </h1>

            <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed mb-6">
              Explore our collection of delicious recipes from around the world. 
              Filter by ingredients, cuisine, or dietary preferences.
            </p>

            {/* Recipe count badge */}
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 px-4 py-2 rounded-full">
              <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              <span className="text-orange-700 font-medium text-sm">
                {loading ? "Loading..." : `${recipes.length} Recipe${recipes.length !== 1 ? 's' : ''} Found`}
              </span>
            </div>
          </div>

          {/* Content Area */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-center shadow-md">
                    <svg className="w-8 h-8 text-orange-500 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-gray-800">Loading delicious recipes...</p>
                  <p className="text-sm text-gray-600">Discovering the perfect meals for you</p>
                </div>
              </div>
            </div>
          ) : recipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.idMeal} recipe={recipe} />
              ))}
            </div>
          ) : (
            hasSearched && (
              <div className="text-center py-20">
                <div className="inline-flex flex-col items-center gap-6">
                  <div className="w-20 h-20 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-800">No recipes found</h3>
                    <p className="text-sm text-gray-600 max-w-md">
                      Try adjusting your search terms or filters to discover more delicious recipes.
                    </p>
                  </div>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-5 py-2.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition duration-200 hover:scale-[1.02]"
                  >
                    Reset Search
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}