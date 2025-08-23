import { useNavigate } from "react-router-dom";
import mealPlannerPhoto from '../../assets/meal-planner-photo.jpg';

export default function MealPlannerPromo() {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 text-gray-900 rounded-3xl p-12 mx-4 md:mx-10 my-12 shadow-2xl overflow-hidden border border-orange-200/50 group hover:shadow-3xl transition-all duration-500">
      {/* Enhanced decorative circles */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-orange-300/20 to-amber-300/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-yellow-300/20 to-orange-300/20 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      {/* Floating elements */}
      <div className="absolute top-16 right-20 w-4 h-4 bg-orange-400/60 rounded-full animate-float"></div>
      <div className="absolute bottom-20 left-16 w-6 h-6 bg-amber-400/60 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-10 w-3 h-3 bg-yellow-400/60 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>

      {/* Pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22%23f97316%22 fill-opacity=%220.05%22%3E%3Cpath d=%22m0 40l40-40h-40v40zm40 0v-40h-40l40 40z%22/%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Text Content */}
        <div className="max-w-xl mb-6 md:mb-0">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-sm border border-orange-200/50">
            <svg className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            AI-Powered Planning
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-lg leading-tight group-hover:text-orange-700 transition-colors duration-300">
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
              Plan Your Meals
            </span>
            <br />
            <span className="relative">
              in a Click
              <span className="text-3xl md:text-4xl ml-2 inline-block animate-bounce">🍽️</span>
            </span>
          </h2>
          
          <p className="text-xl text-gray-700 mb-8 leading-relaxed font-medium">
            Generate a <span className="text-orange-600 font-bold">personalized meal plan</span> for any diet and calories per day using AI.
            <br />
            <span className="text-amber-600 font-semibold">Healthy, tasty, and ready</span> for your lifestyle!
          </p>

          {/* Feature highlights */}
          <div className="flex flex-wrap gap-3 mb-8">
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-full text-sm font-medium text-gray-700 border border-orange-200/50 shadow-sm">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Custom Calories
            </div>
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-full text-sm font-medium text-gray-700 border border-orange-200/50 shadow-sm">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Any Diet Type
            </div>
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-full text-sm font-medium text-gray-700 border border-orange-200/50 shadow-sm">
              <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Instant Results
            </div>
          </div>

          <button
            onClick={() => navigate("/meal-planner")}
            className="group/btn relative bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              Generate My Meal Plan
              <svg className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>
        </div>

        {/* Image / Illustration */}
        <div className="hidden md:flex md:w-1/2 justify-center items-center group/image">
          <div className="relative transform transition-all duration-500 group-hover:scale-105">
            {/* Image glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-400 rounded-3xl blur-2xl opacity-0 group-hover/image:opacity-30 transition-opacity duration-500"></div>
            
            <img 
              src={mealPlannerPhoto} 
              alt="Meal Planner" 
              className="relative rounded-3xl shadow-2xl border-2 border-orange-200/50 object-cover transform transition-all duration-500 group-hover/image:shadow-3xl group-hover/image:border-orange-300/70"
              style={{ width: '350px', maxWidth: '100%', height: 'auto' }}
            />
            
            {/* Decorative frame elements */}
            <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-orange-400 rounded-tl-lg opacity-0 group-hover/image:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-orange-400 rounded-tr-lg opacity-0 group-hover/image:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-orange-400 rounded-bl-lg opacity-0 group-hover/image:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-orange-400 rounded-br-lg opacity-0 group-hover/image:opacity-100 transition-opacity duration-500"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(180deg); }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}