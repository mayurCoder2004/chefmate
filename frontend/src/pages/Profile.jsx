import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [savedRecipes, setSavedRecipes] = useState([]);
  const [savedMealPlans, setSavedMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Fetch saved recipes and meal plans
  const fetchSavedData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Recipes
      const resRecipes = await fetch(`${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}/api/recipes/saved`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const dataRecipes = await resRecipes.json();
      if (!resRecipes.ok) throw new Error(dataRecipes.error || "Failed to fetch recipes");
      setSavedRecipes(dataRecipes.savedRecipes || []);

      // Meal Plans
      const resPlans = await fetch(`${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}/api/meal-plan`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const dataPlans = await resPlans.json();
      if (!resPlans.ok) throw new Error(dataPlans.error || "Failed to fetch meal plans");
      setSavedMealPlans(dataPlans.savedMealPlans || []);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedData();
  }, []);

  const handleRemoveRecipe = async (id) => {
    if (!window.confirm("Are you sure you want to remove this recipe?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}/api/recipes/remove/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove recipe");
      setSavedRecipes(data.savedRecipes);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-primary/20 max-w-4xl w-full">

        {/* User Info */}
        <div className="text-center border-b pb-6 mb-6">
          <h2 className="text-3xl font-bold mb-2 text-primary">Welcome, {user?.name}</h2>
          <p className="text-gray-600">Email: {user?.email}</p>
        </div>

        {loading && <p className="text-gray-500">Loading saved data...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Tabs */}
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2 text-primary">Your Saved Recipes</h3>
          {savedRecipes.length === 0 && <p className="text-gray-500">No saved recipes yet.</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {savedRecipes.map((recipe, idx) => (
              <div key={recipe._id || idx} className="bg-secondary p-4 rounded-lg shadow-sm border border-primary/10 flex flex-col justify-between">
                <div>
                  <h4 className="font-medium text-accent">{recipe.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {recipe.cookingSteps?.length ? `Steps: ${recipe.cookingSteps.length}` : "No steps"} •{" "}
                    {recipe.estimatedTime ? `${recipe.estimatedTime} min` : "Time N/A"}
                  </p>
                  <button
                    onClick={() => navigate(`/ai-recipe/${recipe._id}`)}
                    className="text-blue-600 hover:underline text-sm mb-2"
                  >
                    View Details
                  </button>
                </div>
                <button
                  onClick={() => handleRemoveRecipe(recipe._id)}
                  className="text-red-600 hover:underline text-sm mt-2 self-start"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-semibold mb-2 text-primary">Your Saved Meal Plans</h3>
          {savedMealPlans.length === 0 && <p className="text-gray-500">No saved meal plans yet.</p>}
          <div className="space-y-4">
            {savedMealPlans.map((plan, idx) => (
              <div key={idx} className="bg-secondary p-4 rounded-lg shadow-sm border border-primary/10">
                <p className="text-sm text-gray-600 mb-2">Diet: {plan.diet} • Saved on {new Date(plan.createdAt).toLocaleDateString()}</p>
                {plan.plan.map(day => (
                  <div key={day.day} className="mb-2">
                    <h4 className="font-semibold text-primary">Day {day.day}</h4>
                    {day.meals.map((meal, i) => (
                      <div key={i} className="mb-1 border-b pb-1">
                        <p><strong>{meal.name}</strong> {meal.calories && `(Calories: ${meal.calories})`}</p>
                        <p className="text-sm"><strong>Ingredients:</strong> {meal.ingredients.join(", ")}</p>
                        <p className="text-sm"><strong>Instructions:</strong> {meal.instructions}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleLogout}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-accent transition"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}
