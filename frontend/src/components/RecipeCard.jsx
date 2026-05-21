import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Clock, MapPin } from "lucide-react";

export default function RecipeCard({ recipe }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group relative"
    >
      {/* Image container with overlay */}
      <div className="relative overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="w-full h-52 object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Category badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-orange-600 shadow-lg">
          {recipe.strCategory}
        </div>
      </div>

      <div className="p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
          {recipe.strMeal}
        </h2>
        
        {/* Meta info */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} className="text-orange-500" />
            <span className="font-medium">{recipe.strArea}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-orange-500" />
            <span className="font-medium">30 min</span>
          </div>
        </div>

        <Link
          to={`/recipe/${recipe.idMeal}`}
          className="inline-flex items-center gap-2 text-sm text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg group/btn"
        >
          View Recipe 
          <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}