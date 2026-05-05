import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Bot, Lock, ArrowRight, Check } from "lucide-react";

const AiRecipeCard = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error('Please log in to access Smart Recipe!', {
        duration: 4000,
        icon: <Lock size={16} />,
      });
      setTimeout(() => { navigate('/login'); }, 1500);
      return;
    }

    navigate("/smart-recipe");
  };

  return (
    <div className="bg-white border border-orange-100 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition duration-200">
      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-600 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
        <Bot size={14} /> AI-Powered
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-3">
        Get Your Smart AI Recipe
      </h2>

      <p className="text-sm text-gray-600 mb-5 leading-relaxed max-w-sm mx-auto">
        Enter your <span className="text-orange-600 font-medium">ingredients</span> and let AI suggest a{" "}
        <span className="font-medium text-gray-700">healthy and tasty recipe</span> just for you!
      </p>

      {/* Feature pills */}
      <div className="flex justify-center gap-4 mb-6 flex-wrap">
        {['Smart Suggestions', 'Ingredient Based'].map((f) => (
          <div key={f} className="flex items-center gap-1.5 text-sm text-gray-600">
            <Check size={13} className="text-orange-500" /> {f}
          </div>
        ))}
      </div>

      <button
        onClick={handleClick}
        className="px-5 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition duration-200 hover:scale-[1.02] inline-flex items-center gap-2"
      >
        Go to Smart Recipe <ArrowRight size={16} />
      </button>
    </div>
  );
};

export default AiRecipeCard;