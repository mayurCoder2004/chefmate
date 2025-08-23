import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function AiRecipePage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}/api/recipes/saved`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        const found = data.savedRecipes.find(r => r._id === id);
        if (!found) throw new Error("Recipe not found");
        setRecipe(found);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">{recipe.title}</h1>
      {recipe.healthBenefits && (
        <p className="mb-2"><strong>Health Benefits:</strong> {recipe.healthBenefits}</p>
      )}
      <p className="mb-2"><strong>Estimated Time:</strong> {recipe.estimatedTime} min</p>
      <p className="mb-2"><strong>Servings:</strong> {recipe.servings || "N/A"}</p>
      <div className="mb-2">
        <strong>Used Ingredients:</strong>
        <ul className="list-disc list-inside">
          {recipe.usedIngredients.map((x, i) => <li key={i}>{x}</li>)}
        </ul>
      </div>
      {recipe.optionalIngredients?.length > 0 && (
        <div className="mb-2">
          <strong>Optional Ingredients:</strong>
          <ul className="list-disc list-inside">
            {recipe.optionalIngredients.map((x, i) => <li key={i}>{x}</li>)}
          </ul>
        </div>
      )}
      {recipe.cookingSteps?.length > 0 && (
        <div className="mb-2">
          <strong>Cooking Steps:</strong>
          <ol className="list-decimal list-inside space-y-1">
            {recipe.cookingSteps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        </div>
      )}
      {recipe.notes && <p><strong>Notes:</strong> {recipe.notes}</p>}
    </div>
  );
}
