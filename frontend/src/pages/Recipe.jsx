import { useEffect, useState } from "react";
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
    <div className="min-h-full bg-gradient-to-br from-orange-50 via-amber-50/50 to-yellow-50/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23f97316\' fill-opacity=\'0.02\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      <div className="absolute top-20 right-32 w-64 h-64 bg-gradient-to-br from-orange-200/20 to-amber-200/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-32 left-20 w-80 h-80 bg-gradient-to-tl from-yellow-200/20 to-orange-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="p-6 lg:p-8 flex gap-8 relative z-10 max-w-7xl mx-auto">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4 sticky top-24 self-start h-fit">
          <div className="transform transition-all duration-300 hover:scale-[1.02]">
            <SidebarFilters onSearch={handleSearch} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full lg:w-3/4">
          {/* Header Section */}
          <div className="text-center mb-12 group">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-orange-500 group-hover:to-orange-600 transition-colors duration-500"></div>
              <div className="relative">
                <svg className="w-12 h-12 text-orange-500 group-hover:text-orange-600 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <div className="absolute inset-0 bg-orange-400 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent via-orange-400 to-orange-500 group-hover:to-orange-600 transition-colors duration-500"></div>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 group-hover:text-orange-700 transition-colors duration-300 tracking-tight">
              <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
                Discover
              </span>
              <br />
              <span className="relative">
                Amazing Recipes
                <span className="text-4xl lg:text-5xl ml-3 inline-block animate-bounce">🍳</span>
              </span>
            </h1>

            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
              Explore our collection of <span className="text-orange-600 font-semibold">delicious recipes</span> from around the world. 
              Filter by ingredients, cuisine, or dietary preferences to find your perfect meal.
            </p>

            {/* Recipe count badge */}
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-100 via-amber-100 to-yellow-100 px-6 py-3 rounded-full border border-orange-200/50 shadow-lg backdrop-blur-sm">
              <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              <span className="text-gray-700 font-semibold">
                {loading ? "Loading..." : `${recipes.length} Recipe${recipes.length !== 1 ? 's' : ''} Found`}
              </span>
            </div>

            <div className="mt-8 flex justify-center">
              <div className="w-32 h-1 bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-400 rounded-full group-hover:w-40 transition-all duration-500"></div>
            </div>
          </div>

          {/* Content Area */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
                    <svg className="w-10 h-10 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-orange-400 blur-2xl opacity-30 animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-gray-900">Loading delicious recipes...</p>
                  <p className="text-gray-600">Discovering the perfect meals for you</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          ) : recipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {recipes.map((recipe, index) => (
                <div
                  key={recipe.idMeal}
                  className="transform transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: `fadeInUp 0.6s ease-out forwards`
                  }}
                >
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
          ) : (
            hasSearched && (
              <div className="text-center py-20">
                <div className="inline-flex flex-col items-center gap-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center shadow-lg">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20.5a7.962 7.962 0 01-5.207-1.209l-2.598 2.598a1 1 0 01-1.414-1.414l2.598-2.598A7.963 7.963 0 014.5 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-900">No recipes found</h3>
                    <p className="text-gray-600 max-w-md">
                      Try adjusting your search terms or filters to discover more delicious recipes.
                    </p>
                  </div>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Reset Search
                  </button>
                </div>
              </div>
            )
          )}
        </div>
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
    </div>
  );
}