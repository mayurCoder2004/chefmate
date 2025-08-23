import React from "react";
import HeroSection from "../components/home/HeroSection";
import RecipeList from "../components/home/RecipeList";
import SearchFilter from "../components/home/SearchFilter";
import AiRecipeCard from "../components/home/AiRecipeCard";

const Home = () => {
  return (
    <div className="p-6">
      <HeroSection />
      <RecipeList />
      <AiRecipeCard />

      <div className="container mx-auto px-4 py-8">
        <SearchFilter />
      </div>
    </div>
  );
};

export default Home;
