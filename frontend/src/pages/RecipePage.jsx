import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function RecipePage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
      .then((res) => res.json())
      .then((data) => setRecipe(data.meals[0]));
  }, [id]);

  if (!recipe) return <p className="text-center mt-10 text-primary">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-secondary rounded-2xl shadow-lg">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-4 text-primary">{recipe.strMeal}</h1>
      
      {/* Image */}
      <img
        src={recipe.strMealThumb}
        alt={recipe.strMeal}
        className="rounded-lg mb-6 shadow-md"
      />
      
      {/* Details */}
      <p className="text-accent mb-2">
        <strong>Category:</strong> {recipe.strCategory}
      </p>
      <p className="text-accent mb-4">
        <strong>Area:</strong> {recipe.strArea}
      </p>

      {/* Ingredients */}
      <h2 className="text-2xl font-semibold mt-6 mb-2 text-primary">Ingredients</h2>
      <ul className="list-disc pl-6 text-gray-800">
        {Array.from({ length: 20 }, (_, i) => i + 1)
          .map(i => recipe[`strIngredient${i}`])
          .filter(ingredient => ingredient)
          .map((ingredient, index) => (
            <li key={index}>
              {ingredient} - {recipe[`strMeasure${index + 1}`]}
            </li>
        ))}
      </ul>

      {/* Instructions */}
      <h2 className="text-2xl font-semibold mt-6 mb-2 text-primary">Instructions</h2>
      <p className="text-gray-800 whitespace-pre-line">{recipe.strInstructions}</p>
    </div>
  );
}
