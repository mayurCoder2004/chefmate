import React from "react";
import HeroSection from "../components/home/HeroSection";
import RecipeList from "../components/home/RecipeList";
import SearchFilter from "../components/home/SearchFilter";
import AiRecipeCard from "../components/home/AiRecipeCard";
import MealPlannerPromo from "../components/home/MealPlannerPromo";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <RecipeList />
      <AiRecipeCard />
      <MealPlannerPromo />
    </div>
  );
};

export default Home;
