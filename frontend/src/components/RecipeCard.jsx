import { Link } from "react-router-dom";

export default function RecipeCard({ recipe }) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100/50 hover:scale-[1.02] hover:-translate-y-1">
      <img
        src={recipe.strMealThumb}
        alt={recipe.strMeal}
        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="p-6 relative">
        <h2 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-orange-700 transition-colors duration-300">{recipe.strMeal}</h2>
        <p className="text-gray-600 text-sm flex items-center gap-2 mb-4">
          {recipe.strCategory} • {recipe.strArea} {/* Added region */}
        </p>
        <Link
          to={`/recipe/${recipe.idMeal}`}
          className="text-orange-600 hover:text-orange-700 font-semibold mt-2 inline-flex items-center gap-2 group/link relative overflow-hidden px-3 py-2 -mx-3 rounded-lg hover:bg-orange-50 transition-all duration-300"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}