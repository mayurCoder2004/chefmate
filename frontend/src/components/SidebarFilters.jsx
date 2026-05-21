import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, X } from "lucide-react";

export default function SidebarFilters({ onSearch }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [area, setArea] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ query, category, area });
  };

  const handleClear = () => {
    setQuery("");
    setCategory("");
    setArea("");
    onSearch({ query: "", category: "", area: "" });
  };

  const hasFilters = query || category || area;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-32 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
            <Filter size={18} className="text-white" />
          </div>
          Filters
        </h2>
        {hasFilters && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Clear all filters"
          >
            <X size={20} />
          </motion.button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Search Meals</label>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="e.g. Chicken, Pasta..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border border-gray-300 pl-10 pr-4 py-3 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-orange-300 focus:border-orange-500 outline-none transition-all bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
          <input
            type="text"
            placeholder="e.g. Dessert, Seafood..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-orange-300 focus:border-orange-500 outline-none transition-all bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Cuisine</label>
          <input
            type="text"
            placeholder="e.g. Italian, Indian..."
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-orange-300 focus:border-orange-500 outline-none transition-all bg-white"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2"
        >
          <Search size={18} /> Search Recipes
        </motion.button>
      </form>

      {/* Quick filters */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Popular Cuisines</p>
        <div className="flex flex-wrap gap-2">
          {['Italian', 'Indian', 'Chinese', 'Mexican', 'Japanese'].map((cuisine) => (
            <motion.button
              key={cuisine}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setArea(cuisine);
                onSearch({ query, category, area: cuisine });
              }}
              className="px-3 py-1.5 bg-gray-100 hover:bg-orange-50 text-gray-700 hover:text-orange-600 text-xs font-semibold rounded-lg transition-all duration-200 border border-gray-200 hover:border-orange-300"
            >
              {cuisine}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}