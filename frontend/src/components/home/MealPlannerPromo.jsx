import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import mealPlannerPhoto from '../../assets/meal-planner-photo.jpg';
import { Utensils, Check } from 'lucide-react';

export default function MealPlannerPromo() {
  const navigate = useNavigate();

  const handleClick = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error('Please log in to access Meal Planner!', { duration: 4000 });
      setTimeout(() => { navigate('/login'); }, 1500);
      return;
    }

    navigate("/meal-planner");
  };

  return (
    <section className="bg-white border border-gray-200 rounded-xl p-6 mx-4 md:mx-10 my-8 shadow-sm hover:shadow-md transition duration-200">
      <div className="flex flex-col md:flex-row items-center gap-8">

        {/* Text Content */}
        <div className="flex-1 max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-600 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            <Utensils size={13} /> AI-Powered Planning
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-3 leading-snug">
            Plan Your Meals in a Click
          </h2>

          <p className="text-sm text-gray-600 mb-5 leading-relaxed">
            Generate a <span className="text-orange-600 font-medium">personalized meal plan</span> for any diet and calories per day using AI. Healthy, tasty, and ready for your lifestyle!
          </p>

          {/* Feature highlights */}
          <div className="flex flex-wrap gap-3 mb-5">
            {['Custom Calories', 'Any Diet Type', 'Instant Results'].map((f) => (
              <div key={f} className="flex items-center gap-1.5 text-sm text-gray-600">
                <Check size={14} className="text-orange-500" /> {f}
              </div>
            ))}
          </div>

          <button
            onClick={handleClick}
            className="px-5 py-2.5 bg-orange-500 text-white rounded-lg font-medium text-sm hover:bg-orange-600 transition duration-200 hover:scale-[1.02]"
          >
            Generate My Meal Plan
          </button>
        </div>

        {/* Image */}
        <div className="hidden md:block flex-shrink-0">
          <img
            src={mealPlannerPhoto}
            alt="Meal Planner"
            className="rounded-xl border border-gray-200 object-cover shadow-sm"
            style={{ width: '280px', maxWidth: '100%', height: 'auto' }}
          />
        </div>
      </div>
    </section>
  );
}