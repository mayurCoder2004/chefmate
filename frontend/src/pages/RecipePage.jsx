import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function RecipePage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
      .then((res) => res.json())
      .then((data) => setRecipe(data.meals[0]));
  }, [id]);

  const handleSaveRecipe = async () => {
    if (!recipe) return;
    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      const ingredients = Array.from({ length: 20 }, (_, i) => recipe[`strIngredient${i + 1}`]).filter(Boolean);

      const mappedRecipe = {
        title: recipe.strMeal,
        usedIngredients: ingredients,
        optionalIngredients: [],
        cookingSteps: recipe.strInstructions ? recipe.strInstructions.split(/\r?\n/) : [],
        estimatedTime: ingredients.length * 5, // heuristic: 5 min per ingredient
        servings: 2, // default
        notes: "",
        healthBenefits: "",
      };

      const res = await fetch(`${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}/api/recipes/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(mappedRecipe),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save recipe");
      alert("Recipe saved successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!recipe) return <p className="text-center mt-10 text-primary">Loading...</p>;

  const ingredients = Array.from({ length: 20 }, (_, i) => recipe[`strIngredient${i + 1}`])
    .filter(Boolean);

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
      <p className="text-accent mb-4">
        <strong>Estimated Time:</strong> {ingredients.length * 5} min
      </p>

      {/* Ingredients */}
      <h2 className="text-2xl font-semibold mt-6 mb-2 text-primary">Ingredients</h2>
      <ul className="list-disc pl-6 text-gray-800">
        {ingredients.map((ingredient, index) => (
          <li key={index}>
            {ingredient} - {recipe[`strMeasure${index + 1}`]}
          </li>
        ))}
      </ul>

      {/* Instructions */}
      <h2 className="text-2xl font-semibold mt-6 mb-2 text-primary">Instructions</h2>
      <p className="text-gray-800 whitespace-pre-line">{recipe.strInstructions}</p>

      {/* Save Button */}
      <div className="mt-6 text-center">
        <button
          onClick={handleSaveRecipe}
          disabled={saving}
          className={`bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {saving ? "Saving..." : "Save Recipe"}
        </button>
      </div>
    </div>
  );
}
