import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChefHat, Sparkles } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 relative overflow-hidden pt-24 pb-12">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-orange-200/20 to-amber-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-orange-200/20 to-amber-200/20 rounded-full blur-3xl" />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23f97316\' fill-opacity=\'0.03\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>

      <div className="p-6 lg:p-8 flex gap-8 relative z-10 max-w-7xl mx-auto">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4 sticky top-24 self-start h-fit">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SidebarFilters onSearch={handleSearch} />
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full lg:w-3/4">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-orange-500 rounded-full"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <ChefHat size={32} className="text-white" />
              </div>
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent via-orange-400 to-orange-500 rounded-full"></div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight"
            >
              Discover <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Amazing Recipes</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-6"
            >
              Explore our collection of delicious recipes from around the world. 
              Filter by ingredients, cuisine, or dietary preferences.
            </motion.p>

            {/* Recipe count badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 px-5 py-2.5 rounded-full shadow-sm"
            >
              <Sparkles size={16} className="text-orange-600" />
              <span className="text-orange-700 font-semibold text-sm">
                {loading ? "Loading..." : `${recipes.length} Recipe${recipes.length !== 1 ? 's' : ''} Found`}
              </span>
            </motion.div>
          </motion.div>

          {/* Content Area */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 overflow-hidden shadow-lg"
                >
                  {/* Image placeholder */}
                  <div className="skeleton-line w-full" style={{height: '220px', borderRadius: '0'}}></div>
                  {/* Content */}
                  <div className="p-5 space-y-3">
                    <div className="skeleton-line h-5 w-3/4 rounded-lg"></div>
                    <div className="skeleton-line h-4 w-1/2 rounded-lg"></div>
                    <div className="skeleton-line h-4 w-2/3 rounded-lg"></div>
                    <div className="skeleton-line h-10 w-2/5 mt-4 rounded-xl"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : recipes.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {recipes.map((recipe, index) => (
                <motion.div
                  key={recipe.idMeal}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <RecipeCard recipe={recipe} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            hasSearched && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <div className="inline-flex flex-col items-center gap-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 rounded-2xl flex items-center justify-center shadow-lg"
                  >
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-3"
                  >
                    <h3 className="text-2xl font-bold text-gray-900">No recipes found</h3>
                    <p className="text-gray-600 max-w-md leading-relaxed">
                      Try adjusting your search terms or filters to discover more delicious recipes.
                    </p>
                  </motion.div>
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
                  >
                    Reset Search
                  </motion.button>
                </div>
              </motion.div>
            )
          )}
        </div>
      </div>
    </div>
  );
}