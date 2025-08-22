import { Link } from "react-router-dom";

export default function RecipeCard({ recipe }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden">
      <img
        src={recipe.strMealThumb}
        alt={recipe.strMeal}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="font-bold text-lg">{recipe.strMeal}</h2>
        <p className="text-gray-600 text-sm">
          {recipe.strCategory} • {recipe.strArea} {/* Added region */}
        </p>
        <Link
          to={`/recipe/${recipe.idMeal}`}
          className="text-primary hover:underline mt-2 block"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}
