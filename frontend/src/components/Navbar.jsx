import { Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import logo from "../assets/chefmate-logo.png";

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext) || {};
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    if (logout) logout();
    setIsMobileMenuOpen(false); // Close mobile menu after logout
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-orange-50/95 via-amber-50/95 to-yellow-50/95 backdrop-blur-md p-4 flex justify-between items-center shadow-2xl fixed top-0 left-0 w-full z-50 border-b border-orange-200/50">
        {/* Background pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22%23f97316%22 fill-opacity=%220.02%22%3E%3Cpath d=%22m0 40l40-40h-40v40zm40 0v-40h-40l40 40z%22/%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        
        <div className="relative z-10 w-full flex justify-between items-center">
          {/* Logo Section */}
          <Link to="/" className="flex items-center group" onClick={closeMobileMenu}>
            <div className="relative overflow-hidden rounded-2xl p-2 md:p-3 bg-gradient-to-r from-white/60 to-orange-50/60 backdrop-blur-sm shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl border border-orange-200/30">
              <img 
                src={logo} 
                alt="ChefMate Logo" 
                className="h-8 md:h-10 w-auto transition-transform duration-300 group-hover:scale-110 filter drop-shadow-sm" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-orange-300/20 to-amber-300/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              
              {/* Floating sparkles around logo */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
              <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300" style={{ animationDelay: "0.5s" }}></div>
            </div>
            
            {/* Logo Text */}
            <div className="ml-2 md:ml-3 hidden sm:block">
              <h1 className="text-xl md:text-2xl font-bold">
                <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
                  ChefMate
                </span>
              </h1>
              <p className="text-xs text-orange-600/70 font-medium -mt-1">AI Cooking Assistant</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-2">
            {user ? (
              // Authenticated user navigation
              <>
                <Link 
                  className={`relative px-4 py-2.5 rounded-2xl transition-all duration-300 font-semibold text-sm overflow-hidden group ${
                    isActive('/') 
                      ? 'bg-gradient-to-r from-orange-400 to-amber-400 text-white shadow-lg' 
                      : 'text-orange-700 hover:text-white hover:bg-gradient-to-r hover:from-orange-400 hover:to-amber-400 hover:shadow-lg'
                  }`} 
                  to="/"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    🏠 Home
                  </span>
                  {!isActive('/') && (
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-2xl"></div>
                  )}
                </Link>

                <Link 
                  className={`relative px-4 py-2.5 rounded-2xl transition-all duration-300 font-semibold text-sm overflow-hidden group ${
                    isActive('/meal-planner') 
                      ? 'bg-gradient-to-r from-emerald-400 to-green-400 text-white shadow-lg' 
                      : 'text-orange-700 hover:text-white hover:bg-gradient-to-r hover:from-emerald-400 hover:to-green-400 hover:shadow-lg'
                  }`} 
                  to="/meal-planner"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    📅 Meal Plans
                  </span>
                  {!isActive('/meal-planner') && (
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-2xl"></div>
                  )}
                </Link>

                <Link 
                  className={`relative px-4 py-2.5 rounded-2xl transition-all duration-300 font-semibold text-sm overflow-hidden group ${
                    isActive('/smart-recipe') 
                      ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-lg' 
                      : 'text-orange-700 hover:text-white hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 hover:shadow-lg'
                  }`} 
                  to="/smart-recipe"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    🤖 AI Recipes
                  </span>
                  {!isActive('/smart-recipe') && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-2xl"></div>
                  )}
                </Link>

                <Link 
                  className={`relative px-4 py-2.5 rounded-2xl transition-all duration-300 font-semibold text-sm overflow-hidden group ${
                    isActive('/profile') 
                      ? 'bg-gradient-to-r from-blue-400 to-indigo-400 text-white shadow-lg' 
                      : 'text-orange-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-400 hover:shadow-lg'
                  }`} 
                  to="/profile"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    👤 Profile
                  </span>
                  {!isActive('/profile') && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-2xl"></div>
                  )}
                </Link>

                {/* User Welcome & Logout */}
                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-orange-200/50">
                  <div className="hidden xl:block">
                    <p className="text-sm font-semibold text-orange-700">
                      👋 Hi, {user?.name || 'Chef'}!
                    </p>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="relative px-4 py-2.5 rounded-2xl transition-all duration-300 font-semibold text-sm overflow-hidden group bg-gradient-to-r from-red-400 to-pink-400 text-white hover:from-red-500 hover:to-pink-500 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      🚪 Logout
                    </span>
                  </button>
                </div>
              </>
            ) : (
              // Guest user navigation
              <>
                <Link 
                  className={`relative px-4 py-2.5 rounded-2xl transition-all duration-300 font-semibold text-sm overflow-hidden group ${
                    isActive('/') 
                      ? 'bg-gradient-to-r from-orange-400 to-amber-400 text-white shadow-lg' 
                      : 'text-orange-700 hover:text-white hover:bg-gradient-to-r hover:from-orange-400 hover:to-amber-400 hover:shadow-lg'
                  }`} 
                  to="/"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    🏠 Home
                  </span>
                  {!isActive('/') && (
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-2xl"></div>
                  )}
                </Link>

                <Link 
                  className={`relative px-4 py-2.5 rounded-2xl transition-all duration-300 font-semibold text-sm overflow-hidden group ${
                    isActive('/login') 
                      ? 'bg-gradient-to-r from-blue-400 to-indigo-400 text-white shadow-lg' 
                      : 'text-orange-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-400 hover:shadow-lg'
                  }`} 
                  to="/login"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    🔑 Login
                  </span>
                  {!isActive('/login') && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-2xl"></div>
                  )}
                </Link>

                <Link 
                  className={`relative px-4 py-2.5 rounded-2xl transition-all duration-300 font-semibold text-sm overflow-hidden group ${
                    isActive('/signup') 
                      ? 'bg-gradient-to-r from-emerald-400 to-green-400 text-white shadow-lg' 
                      : 'text-orange-700 hover:text-white hover:bg-gradient-to-r hover:from-emerald-400 hover:to-green-400 hover:shadow-lg'
                  }`} 
                  to="/signup"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    ✨ Sign Up
                  </span>
                  {!isActive('/signup') && (
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-2xl"></div>
                  )}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden relative p-2 rounded-xl bg-gradient-to-r from-white/60 to-orange-50/60 backdrop-blur-sm shadow-lg border border-orange-200/30 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            aria-label="Toggle mobile menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block w-5 h-0.5 bg-orange-600 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-orange-600 transition-all duration-300 mt-1 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-orange-600 transition-all duration-300 mt-1 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={closeMobileMenu}></div>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-gradient-to-b from-orange-50/98 via-amber-50/98 to-yellow-50/98 backdrop-blur-lg shadow-2xl z-50 transform transition-transform duration-300 border-l border-orange-200/50 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Mobile Menu Header */}
        <div className="p-6 border-b border-orange-200/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img src={logo} alt="ChefMate Logo" className="h-8 w-auto" />
              <div className="ml-3">
                <h2 className="text-lg font-bold">
                  <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
                    ChefMate
                  </span>
                </h2>
                <p className="text-xs text-orange-600/70 font-medium -mt-1">AI Cooking Assistant</p>
              </div>
            </div>
            <button
              onClick={closeMobileMenu}
              className="p-2 rounded-xl bg-gradient-to-r from-white/60 to-orange-50/60 shadow-lg border border-orange-200/30 transition-all duration-300 hover:scale-105"
              aria-label="Close mobile menu"
            >
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Content */}
        <div className="p-6 space-y-4 overflow-y-auto h-full pb-20">
          {user ? (
            // Authenticated user mobile navigation
            <>
              {/* User Welcome */}
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-white/60 to-orange-50/60 border border-orange-200/30">
                <p className="text-lg font-semibold text-orange-700">
                  👋 Hi, {user?.name || 'Chef'}!
                </p>
                <p className="text-sm text-orange-600/70">Welcome back to ChefMate</p>
              </div>

              <Link 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-semibold text-base ${
                  isActive('/') 
                    ? 'bg-gradient-to-r from-orange-400 to-amber-400 text-white shadow-lg' 
                    : 'text-orange-700 hover:bg-gradient-to-r hover:from-orange-400 hover:to-amber-400 hover:text-white hover:shadow-lg'
                }`} 
                to="/"
                onClick={closeMobileMenu}
              >
                <span className="text-xl">🏠</span>
                <span>Home</span>
              </Link>

              <Link 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-semibold text-base ${
                  isActive('/meal-planner') 
                    ? 'bg-gradient-to-r from-emerald-400 to-green-400 text-white shadow-lg' 
                    : 'text-orange-700 hover:bg-gradient-to-r hover:from-emerald-400 hover:to-green-400 hover:text-white hover:shadow-lg'
                }`} 
                to="/meal-planner"
                onClick={closeMobileMenu}
              >
                <span className="text-xl">📅</span>
                <span>Meal Plans</span>
              </Link>

              <Link 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-semibold text-base ${
                  isActive('/smart-recipe') 
                    ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-lg' 
                    : 'text-orange-700 hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 hover:text-white hover:shadow-lg'
                }`} 
                to="/smart-recipe"
                onClick={closeMobileMenu}
              >
                <span className="text-xl">🤖</span>
                <span>AI Recipes</span>
              </Link>

              <Link 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-semibold text-base ${
                  isActive('/profile') 
                    ? 'bg-gradient-to-r from-blue-400 to-indigo-400 text-white shadow-lg' 
                    : 'text-orange-700 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-400 hover:text-white hover:shadow-lg'
                }`} 
                to="/profile"
                onClick={closeMobileMenu}
              >
                <span className="text-xl">👤</span>
                <span>Profile</span>
              </Link>

              {/* Logout Button */}
              <div className="pt-4 mt-6 border-t border-orange-200/30">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-semibold text-base bg-gradient-to-r from-red-400 to-pink-400 text-white hover:from-red-500 hover:to-pink-500 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span className="text-xl">🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            // Guest user mobile navigation
            <>
              <Link 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-semibold text-base ${
                  isActive('/') 
                    ? 'bg-gradient-to-r from-orange-400 to-amber-400 text-white shadow-lg' 
                    : 'text-orange-700 hover:bg-gradient-to-r hover:from-orange-400 hover:to-amber-400 hover:text-white hover:shadow-lg'
                }`} 
                to="/"
                onClick={closeMobileMenu}
              >
                <span className="text-xl">🏠</span>
                <span>Home</span>
              </Link>

              <Link 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-semibold text-base ${
                  isActive('/login') 
                    ? 'bg-gradient-to-r from-blue-400 to-indigo-400 text-white shadow-lg' 
                    : 'text-orange-700 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-400 hover:text-white hover:shadow-lg'
                }`} 
                to="/login"
                onClick={closeMobileMenu}
              >
                <span className="text-xl">🔑</span>
                <span>Login</span>
              </Link>

              <Link 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-semibold text-base ${
                  isActive('/signup') 
                    ? 'bg-gradient-to-r from-emerald-400 to-green-400 text-white shadow-lg' 
                    : 'text-orange-700 hover:bg-gradient-to-r hover:from-emerald-400 hover:to-green-400 hover:text-white hover:shadow-lg'
                }`} 
                to="/signup"
                onClick={closeMobileMenu}
              >
                <span className="text-xl">✨</span>
                <span>Sign Up</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}