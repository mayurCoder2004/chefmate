import React from "react";
import { useNavigate } from "react-router-dom";
import { Utensils, Check } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-16 px-6 text-center border-b border-gray-100">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-600 text-xs font-medium px-4 py-1.5 rounded-full">
          <Utensils size={14} /> Featured Experience
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 leading-tight">
          Discover Recipes<br />
          <span className="text-orange-600">Made Just for You</span>
        </h1>

        {/* Subheading */}
        <p className="text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Get <span className="text-orange-600 font-medium">personalized recipe recommendations</span> based on your taste &amp; ingredients at home.
        </p>

        {/* Feature highlights */}
        <div className="flex justify-center gap-6 flex-wrap">
          {['AI Powered', 'Personalized', 'Easy to Follow'].map((label) => (
            <div key={label} className="flex items-center gap-1.5 text-sm text-gray-600">
              <Check size={14} className="text-orange-500" />
              {label}
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex justify-center gap-3 flex-wrap">
          <button
            onClick={() => navigate("/recipes")}
            className="px-5 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition duration-200 hover:scale-[1.02]"
          >
            Explore Recipes
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition duration-200"
          >
            Sign Up Free
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;