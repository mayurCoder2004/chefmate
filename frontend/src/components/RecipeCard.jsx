import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function RecipeCard({ recipe }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:scale-[1.02] transition-all duration-200 group">
      <img
        src={recipe.strMealThumb}
        alt={recipe.strMeal}
        className="w-full h-44 object-cover"
      />
      <div className="p-4">
        <h2 className="text-base font-semibold text-gray-800 mb-1 group-hover:text-orange-600 transition-colors">
          {recipe.strMeal}
        </h2>
        <p className="text-sm text-gray-500 mb-3">
          {recipe.strCategory} · {recipe.strArea}
        </p>
        <Link
          to={`/recipe/${recipe.idMeal}`}
          className="inline-flex items-center gap-1.5 text-sm text-orange-600 font-medium hover:text-orange-700 transition-colors"
        >
          View Details <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}