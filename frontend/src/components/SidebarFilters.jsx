import { useState } from "react";

export default function SidebarFilters({ onSearch }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(""); // optional filter
  const [area, setArea] = useState(""); // optional filter

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ query, category, area });
  };

  return (
    <div className="mt-32 bg-gradient-to-br from-white to-gray-50/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border border-gray-100/50 group">
      <h2 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-orange-700 transition-colors duration-300">Search & Filters</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search meals..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-white/80 hover:bg-white focus:bg-white placeholder-gray-400 text-gray-900"
          />
          <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Optional: Category filter */}
        <div className="relative">
          <input
            type="text"
            placeholder="Category (optional)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-white/80 hover:bg-white focus:bg-white placeholder-gray-400 text-gray-900"
          />
          <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </div>

        {/* Optional: Area filter */}
        <div className="relative">
          <input
            type="text"
            placeholder="Area (optional)"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-white/80 hover:bg-white focus:bg-white placeholder-gray-400 text-gray-900"
          />
          <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>

        <button
          type="submit"
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 group/button"
        >
          <span>Search</span>
          <svg className="w-4 h-4 transition-transform duration-300 group-hover/button:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>
    </div>
  );
}