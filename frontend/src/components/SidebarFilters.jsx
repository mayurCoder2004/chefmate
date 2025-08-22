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
    <div className="bg-white p-4 shadow-md rounded-md flex flex-col gap-4">
      <h2 className="text-xl font-bold mb-2">Search & Filters</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Search meals..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 rounded-md"
        />

        {/* Optional: Category filter */}
        <input
          type="text"
          placeholder="Category (optional)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded-md"
        />

        {/* Optional: Area filter */}
        <input
          type="text"
          placeholder="Area (optional)"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="border p-2 rounded-md"
        />

        <button
          type="submit"
          className="bg-primary text-white p-2 rounded-md hover:bg-green-700 transition"
        >
          Search
        </button>
      </form>
    </div>
  );
}
