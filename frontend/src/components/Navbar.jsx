import { Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import logo from "../assets/chefmate-logo.png";
import { Home, Bookmark, Menu, User, LogOut, KeyRound, UserPlus } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext) || {};
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    if (logout) logout();
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const desktopLink = (active, gradient) =>
    `relative px-4 py-2.5 rounded-2xl transition-all duration-300 font-semibold text-sm overflow-hidden group ${
      active
        ? `bg-gradient-to-r ${gradient} text-white shadow-lg`
        : `text-orange-700 hover:text-white hover:bg-gradient-to-r hover:${gradient} hover:shadow-lg`
    }`;

  const mobileLink = (active, gradient) =>
    `w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-semibold text-base ${
      active
        ? `bg-gradient-to-r ${gradient} text-white shadow-lg`
        : `text-orange-700 hover:bg-gradient-to-r hover:${gradient} hover:text-white hover:shadow-lg`
    }`;

  const NAV_LINKS = [
    { to: '/app',     label: 'Home',  icon: Home,     gradient: 'from-orange-400 to-amber-400' },
    { to: '/profile', label: 'Saved', icon: Bookmark, gradient: 'from-blue-400 to-indigo-400' },
    { to: '/more',    label: 'More',  icon: Menu,     gradient: 'from-purple-400 to-pink-400' },
  ];

  return (
    <>
      <nav className="bg-gradient-to-r from-orange-50/95 via-amber-50/95 to-yellow-50/95 backdrop-blur-md p-4 flex justify-between items-center shadow-2xl fixed top-0 left-0 w-full z-50 border-b border-orange-200/50">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22%23f97316%22 fill-opacity=%220.02%22%3E%3Cpath d=%22m0 40l40-40h-40v40zm40 0v-40h-40l40 40z%22/%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>

        <div className="relative z-10 w-full flex justify-between items-center">
          {/* Logo */}
          <Link to="/app" className="flex items-center group" onClick={closeMobileMenu}>
            <div className="relative overflow-hidden rounded-2xl p-2 md:p-3 bg-gradient-to-r from-white/60 to-orange-50/60 backdrop-blur-sm shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl border border-orange-200/30">
              <img src={logo} alt="ChefMate Logo" className="h-8 md:h-10 w-auto transition-transform duration-300 group-hover:scale-110 filter drop-shadow-sm" />
              <div className="absolute inset-0 bg-gradient-to-r from-orange-300/20 to-amber-300/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
              <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300" style={{ animationDelay: "0.5s" }}></div>
            </div>
            <div className="ml-2 md:ml-3 hidden sm:block">
              <h1 className="text-xl md:text-2xl font-bold">
                <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">ChefMate</span>
              </h1>
              <p className="text-xs text-orange-600/70 font-medium -mt-1">AI Cooking Assistant</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-2">
            {NAV_LINKS.map(({ to, label, icon: Icon, gradient }) => (
              <Link key={to} className={desktopLink(isActive(to), gradient)} to={to}>
                <span className="relative z-10 flex items-center gap-2"><Icon size={16} /> {label}</span>
                {!isActive(to) && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${gradient} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-2xl`}></div>
                )}
              </Link>
            ))}

            {user && (
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-orange-200/50">
                <div className="hidden xl:block">
                  <p className="text-sm font-semibold text-orange-700 flex items-center gap-1"><User size={16} /> Hi, {user?.name || 'Chef'}!</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="relative px-4 py-2.5 rounded-2xl transition-all duration-300 font-semibold text-sm bg-gradient-to-r from-red-400 to-pink-400 text-white hover:from-red-500 hover:to-pink-500 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span className="flex items-center gap-2"><LogOut size={16} /> Logout</span>
                </button>
              </div>
            )}

            {!user && (
              <div className="flex items-center gap-2 ml-2">
                <Link to="/login" className={desktopLink(isActive('/login'), 'from-blue-400 to-indigo-400')}>
                  <span className="relative z-10 flex items-center gap-2"><KeyRound size={16} /> Login</span>
                  {!isActive('/login') && <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-2xl"></div>}
                </Link>
                <Link to="/signup" className={desktopLink(isActive('/signup'), 'from-emerald-400 to-green-400')}>
                  <span className="relative z-10 flex items-center gap-2"><UserPlus size={16} /> Sign Up</span>
                  {!isActive('/signup') && <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-2xl"></div>}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
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

      {/* Mobile Overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={closeMobileMenu}
      ></div>

      {/* Mobile Drawer */}
      <div className={`lg:hidden fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-gradient-to-b from-orange-50/98 via-amber-50/98 to-yellow-50/98 backdrop-blur-lg shadow-2xl z-50 transform transition-transform duration-300 border-l border-orange-200/50 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Drawer Header */}
        <div className="p-6 border-b border-orange-200/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img src={logo} alt="ChefMate Logo" className="h-8 w-auto" />
              <div className="ml-3">
                <h2 className="text-lg font-bold">
                  <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">ChefMate</span>
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

        {/* Drawer Content */}
        <div className="p-6 space-y-4 overflow-y-auto h-full pb-20">
          {user && (
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-white/60 to-orange-50/60 border border-orange-200/30">
              <p className="text-lg font-semibold text-orange-700 flex items-center gap-2"><User size={18} /> Hi, {user?.name || 'Chef'}!</p>
              <p className="text-sm text-orange-600/70">Welcome back to ChefMate</p>
            </div>
          )}

          {NAV_LINKS.map(({ to, label, icon: Icon, gradient }) => (
            <Link
              key={to}
              className={mobileLink(isActive(to), gradient)}
              to={to}
              onClick={closeMobileMenu}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}

          {user ? (
            <div className="pt-4 mt-6 border-t border-orange-200/30">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-base bg-gradient-to-r from-red-400 to-pink-400 text-white hover:from-red-500 hover:to-pink-500 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="pt-4 mt-6 border-t border-orange-200/30 space-y-3">
              <Link className={mobileLink(isActive('/login'), 'from-blue-400 to-indigo-400')} to="/login" onClick={closeMobileMenu}>
                <KeyRound size={20} /><span>Login</span>
              </Link>
              <Link className={mobileLink(isActive('/signup'), 'from-emerald-400 to-green-400')} to="/signup" onClick={closeMobileMenu}>
                <UserPlus size={20} /><span>Sign Up</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}