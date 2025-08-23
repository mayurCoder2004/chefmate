import React from "react";
import { useNavigate } from "react-router-dom";

const AiRecipeCard = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Get Your Smart AI Recipe</h2>
      <p className="text-gray-700 mb-4">
        Enter your ingredients and let AI suggest a healthy and tasty recipe just for you!
      </p>
      <button
        onClick={() => navigate("/smart-recipe")}
        className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium shadow hover:bg-emerald-700 transition"
      >
        Go to Smart Recipe
      </button>
    </div>
  );
};

export default AiRecipeCard;
