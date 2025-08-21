import React from 'react'

const HeroSection = () => {
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

        {/* Search Bar */}
        <div className="flex justify-center items-center gap-2 max-w-lg mx-auto">
          <input
            type="text"
            placeholder="Search recipes..."
            className="w-full px-4 py-3 rounded-2xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button className="px-6 py-3 rounded-2xl bg-primary text-white font-semibold shadow-lg hover:bg-accent transition">
            Search
          </button>
        </div>

        {/* CTA Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          <button className="px-6 py-3 rounded-2xl bg-accent text-white font-semibold shadow-lg hover:bg-primary transition">
            Explore Recipes
          </button>
          <button className="px-6 py-3 rounded-2xl bg-white border border-primary text-primary font-semibold shadow-md hover:bg-gray-100 transition">
            Sign Up Free
          </button>
        </div>
      </div>
    </section>
  )
}

export default HeroSection