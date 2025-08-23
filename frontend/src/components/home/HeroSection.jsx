import React from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-br from-[#FFDEE9] via-[#FFE5EC] to-[#B5FFFC] py-24 px-6 text-center min-h-screen flex items-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-200/20 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '3s' }}></div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-6 h-6 bg-orange-400/60 rounded-full animate-float"></div>
      <div className="absolute top-32 right-16 w-4 h-4 bg-cyan-400/60 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-24 left-1/4 w-8 h-8 bg-pink-400/60 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/4 right-1/4 w-5 h-5 bg-amber-400/60 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Decorative element above heading */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-4 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30 shadow-lg">
            <svg className="w-6 h-6 text-orange-500 animate-spin" style={{ animationDuration: '3s' }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span className="text-gray-700 font-medium text-sm tracking-wider uppercase">Featured Experience</span>
            <svg className="w-6 h-6 text-orange-500 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-800 mb-6 leading-tight tracking-tight">
          <span className="bg-gradient-to-r from-orange-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent animate-gradient">
            Discover Recipes
          </span>
          <br />
          <span className="relative">
            Made Just for You
            <span className="text-4xl md:text-6xl ml-2 inline-block animate-bounce">🍲</span>
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto font-medium">
          Get <span className="text-orange-600 font-semibold">personalized recipe recommendations</span> based on your taste & ingredients at home.
        </p>

        {/* Feature highlights */}
        <div className="flex justify-center gap-8 mb-10 flex-wrap">
          <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/40">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-700 font-medium text-sm">AI Powered</span>
          </div>
          <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/40">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-700 font-medium text-sm">Personalized</span>
          </div>
          <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/40">
            <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-700 font-medium text-sm">Easy to Follow</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-8 flex justify-center gap-6 flex-wrap">
          {/* Explore Recipes navigates to recipes page */}
          <button
            onClick={() => navigate("/recipes")}
            className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              Explore Recipes
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>

          {/* Sign Up navigates to signup page */}
          <button
            onClick={() => navigate("/signup")}
            className="group relative px-8 py-4 rounded-2xl bg-white/90 backdrop-blur-sm border-2 border-orange-300 hover:border-orange-400 text-orange-600 hover:text-orange-700 font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              Sign Up Free
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-amber-50 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;