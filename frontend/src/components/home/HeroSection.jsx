import React from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-r from-[#FFDEE9] to-[#B5FFFC] py-20 px-6 text-center">
      <div className="max-w-3xl mx-auto">
        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-4">
          Discover Recipes Made Just for You 🍲
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-gray-600 mb-6">
          Get personalized recipe recommendations based on your taste & ingredients at home.
        </p>

        {/* CTA Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          {/* Explore Recipes navigates to recipes page */}
          <button
            onClick={() => navigate("/recipes")}
            className="px-6 py-3 rounded-2xl bg-accent text-white font-semibold shadow-lg hover:bg-primary transition"
          >
            Explore Recipes
          </button>

          {/* Sign Up navigates to signup page */}
          <button
            onClick={() => navigate("/signup")}
            className="px-6 py-3 rounded-2xl bg-white border border-primary text-primary font-semibold shadow-md hover:bg-gray-100 transition"
          >
            Sign Up Free
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;