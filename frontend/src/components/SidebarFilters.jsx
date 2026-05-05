import { useState } from "react";
import { Search } from "lucide-react";

export default function SidebarFilters({ onSearch }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [area, setArea] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ query, category, area });
  };

  return (
    <div className="mt-32 bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition duration-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Search size={18} className="text-orange-500" />
        Search & Filters
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Search Meals</label>
          <input
            type="text"
            placeholder="e.g. Chicken, Pasta..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <input
            type="text"
            placeholder="e.g. Dessert, Seafood..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine</label>
          <input
            type="text"
            placeholder="e.g. Italian, Indian..."
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none transition-all"
          />
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-orange-500 text-white rounded-lg font-medium text-sm hover:bg-orange-600 transition duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
        >
          <Search size={16} /> Search Recipes
        </button>
      </form>
    </div>
  );
}