import { useNavigate } from "react-router-dom";
import mealPlannerPhoto from '../../assets/meal-planner-photo.jpg';

export default function MealPlannerPromo() {
  const navigate = useNavigate();

  return (
    <section className="relative bg-secondary text-primary rounded-3xl p-10 mx-4 md:mx-10 my-8 shadow-lg overflow-hidden border border-primary/20">
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/10 rounded-full translate-x-1/2 translate-y-1/2"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
        {/* Text */}
        <div className="max-w-xl mb-6 md:mb-0">
          <h2 className="text-4xl font-extrabold mb-4 drop-shadow-md">
            Plan Your Meals in a Click 🍽️
          </h2>
          <p className="text-lg text-primary/80 mb-6">
            Generate a personalized meal plan for any diet and calories per day using AI.
            Healthy, tasty, and ready for your lifestyle!
          </p>
          <button
            onClick={() => navigate("/meal-planner")}
            className="bg-primary text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-accent hover:scale-105 transform transition"
          >
            Generate My Meal Plan
          </button>
        </div>

        {/* Image / Illustration */}
        <div className="hidden md:flex md:w-1/2 justify-center items-center">
  <img 
    src={mealPlannerPhoto} 
    alt="Meal Planner" 
    className="rounded-2xl shadow-lg border border-primary/20 object-cover"
    style={{ width: '300px', maxWidth: '100%', height: 'auto' }}
  />
</div>
      </div>
    </section>
  );
}
