import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AiRecipeCard = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    
    if (!token) {
      toast.error('Please log in to access Smart Recipe! 🔐', {
        duration: 4000,
        style: {
          background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
          color: '#991b1b',
          border: '2px solid rgba(239, 68, 68, 0.3)',
          fontWeight: '600',
          fontSize: '14px',
          borderRadius: '16px',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          maxWidth: '400px',
        },
        iconTheme: {
          primary: '#ef4444',
          secondary: '#ffffff',
        },
      });
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      return;
    }
    
    // If logged in, proceed to smart recipe page
    navigate("/smart-recipe");
  };

  return (
    <div className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 border-orange-200/50 rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-200/30 to-transparent rounded-full blur-2xl animate-pulse"></div>
      <div
        className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-amber-200/30 to-transparent rounded-full blur-2xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      {/* Floating elements */}
      <div className="absolute top-4 left-6 w-3 h-3 bg-orange-400/60 rounded-full animate-float"></div>
      <div
        className="absolute top-6 right-8 w-4 h-4 bg-amber-400/60 rounded-full animate-float"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute bottom-6 left-1/4 w-2 h-2 bg-yellow-400/60 rounded-full animate-float"
        style={{ animationDelay: "2s" }}
      ></div>

      {/* Pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2230%22 height=%2230%22 viewBox=%220 0 30 30%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%23f97316 fill-opacity=%220.04%22%3E%3Ccircle cx=%2215%22 cy=%2215%22 r=%222%22/%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>

      <div className="relative z-10">
        {/* AI Badge */}
        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-bold mb-6 shadow-sm border border-orange-200/50 group-hover:scale-105 transition-transform duration-300">
          <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
            <svg
              className="w-3 h-3 text-white animate-pulse"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
            </svg>
          </div>
          <span>AI-Powered</span>
        </div>

        <h2 className="text-3xl font-bold mb-6 text-gray-900 group-hover:text-orange-700 transition-colors duration-300">
          <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
            Get Your Smart
          </span>
          <br />
          <span className="relative">
            AI Recipe
            <span className="text-2xl ml-2 inline-block animate-bounce">🤖</span>
          </span>
        </h2>

        <p className="text-lg text-gray-700 mb-8 leading-relaxed max-w-md mx-auto">
          Enter your{" "}
          <span className="text-orange-600 font-semibold">ingredients</span> and
          let AI suggest a
          <span className="text-amber-600 font-semibold">
            {" "}
            healthy and tasty recipe
          </span>{" "}
          just for you!
        </p>

        {/* Feature highlights */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-full text-sm font-medium text-gray-700 border border-orange-200/50 shadow-sm">
            <svg
              className="w-4 h-4 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Smart Suggestions
          </div>
          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-full text-sm font-medium text-gray-700 border border-orange-200/50 shadow-sm">
            <svg
              className="w-4 h-4 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Ingredient Based
          </div>
        </div>

        <button
          onClick={handleClick}
          className="group/btn relative bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover/btn:-rotate-12"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
            </svg>
            Go to Smart Recipe
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left"></div>
        </button>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-12px) rotate(180deg);
            opacity: 1;
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AiRecipeCard;