import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed top-0 left-0 w-80 h-80 bg-gradient-to-br from-orange-300/10 to-amber-300/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-yellow-300/10 to-orange-300/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

      {/* Floating elements */}
      <div className="fixed top-20 right-20 w-4 h-4 bg-orange-400/40 rounded-full animate-float"></div>
      <div 
        className="fixed bottom-32 left-16 w-6 h-6 bg-amber-400/40 rounded-full animate-float"
        style={{ animationDelay: "2s" }}
      ></div>
      <div 
        className="fixed top-1/2 left-10 w-3 h-3 bg-yellow-400/40 rounded-full animate-float"
        style={{ animationDelay: "1s" }}
      ></div>

      {/* Main Error Content */}
      <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-2xl border border-orange-200/50 text-center max-w-2xl w-full group hover:shadow-3xl transition-all duration-500 overflow-hidden">
        {/* Pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22%23f97316%22 fill-opacity=%220.03%22%3E%3Cpath d=%22m0 40l40-40h-40v40zm40 0v-40h-40l40 40z%22/%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        <div className="relative z-10">
          {/* Animated Chef Icon */}
          <div className="text-8xl mb-6 animate-bounce">
            👨‍🍳
          </div>

          {/* 404 Number with gradient */}
          <h1 className="text-8xl sm:text-9xl font-extrabold mb-6 drop-shadow-lg">
            <span className="bg-gradient-to-r from-red-500 via-pink-500 to-red-600 bg-clip-text text-transparent">
              404
            </span>
          </h1>

          {/* Error Message */}
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
              Oops! Recipe Not Found
            </span>
            <span className="text-2xl ml-2 inline-block animate-bounce">🍽️</span>
          </h2>

          <p className="text-xl text-orange-700/80 font-medium mb-8 leading-relaxed">
            Looks like this page got lost in the kitchen! 🔍<br />
            <span className="text-lg">The recipe you're looking for might have been moved or doesn't exist.</span>
          </p>

          {/* Fun cooking-related message */}
          <div className="bg-gradient-to-r from-amber-50/80 to-yellow-50/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50 mb-8">
            <div className="text-4xl mb-3">🧑‍🍳</div>
            <p className="text-amber-700 font-semibold text-lg">
              "Even the best chefs sometimes can't find their ingredients!"
            </p>
            <p className="text-amber-600 text-sm mt-2">
              Let's get you back to cooking up something amazing! ✨
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/")}
              className="relative bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 text-lg flex items-center justify-center gap-3 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                🏠 Go to Home
              </span>
            </button>

            <button
              onClick={() => navigate(-1)}
              className="relative bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 hover:from-blue-600 hover:via-indigo-600 hover:to-blue-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 text-lg flex items-center justify-center gap-3 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                ↩️ Go Back
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Additional decorative elements */}
      <div className="mt-8 text-center">
        <div className="flex justify-center gap-4 text-4xl animate-pulse">
          <span style={{ animationDelay: "0s" }}>🍕</span>
          <span style={{ animationDelay: "0.5s" }}>🍔</span>
          <span style={{ animationDelay: "1s" }}>🍝</span>
          <span style={{ animationDelay: "1.5s" }}>🥗</span>
          <span style={{ animationDelay: "2s" }}>🍰</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(180deg);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}