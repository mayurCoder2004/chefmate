import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const fetchSavedRecipes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}/api/recipes/saved`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch saved recipes");
      setSavedRecipes(data.savedRecipes || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedRecipes();
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
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-primary/20 max-w-3xl w-full">
        
        {/* User Info */}
        <div className="text-center border-b pb-6 mb-6">
          <h2 className="text-3xl font-bold mb-2 text-primary">
            Welcome, {user?.name}
          </h2>
          <p className="text-gray-600">Email: {user?.email}</p>
        </div>

        {/* Saved Recipes Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-primary">
            Your Saved Recipes
          </h3>

          {loading && <p className="text-gray-500">Loading recipes...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && savedRecipes.length === 0 && (
            <p className="text-gray-500">You have no saved recipes yet.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedRecipes.map((recipe, idx) => (
              <div
                key={recipe._id || idx}
                className="bg-secondary p-4 rounded-lg shadow-sm border border-primary/10 flex flex-col justify-between"
              >
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
