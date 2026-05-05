import { Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import logo from "../assets/chefmate-logo.png";
import { Home, Bookmark, Menu, User, LogOut, KeyRound, UserPlus, X } from 'lucide-react';

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

  const NAV_LINKS = [
    { to: '/app',     label: 'Home',  icon: Home     },
    { to: '/profile', label: 'Saved', icon: Bookmark },
    { to: '/more',    label: 'More',  icon: Menu     },
  ];

  const desktopLinkClass = (active) =>
    `flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      active
        ? 'bg-orange-500 text-white'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
    }`;

  const mobileLinkClass = (active) =>
    `w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      active
        ? 'bg-orange-500 text-white'
        : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <>
      <nav className="bg-white border-b border-gray-200 p-4 flex justify-between items-center fixed top-0 left-0 w-full z-50 shadow-sm">
        {/* Logo */}
        <Link to="/app" className="flex items-center gap-2 hover:opacity-80 transition" onClick={closeMobileMenu}>
          <img src={logo} alt="ChefMate Logo" className="h-8 w-auto" />
          <span className="hidden sm:block text-lg font-semibold text-gray-800">ChefMate</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} className={desktopLinkClass(isActive(to))}>
              <Icon size={16} /> {label}
            </Link>
          ))}

          {user && (
            <div className="flex items-center gap-3 ml-3 pl-3 border-l border-gray-200">
              <span className="hidden xl:flex items-center gap-1 text-sm text-gray-600">
                <User size={15} /> Hi, {user?.name || 'Chef'}!
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition duration-200"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}

          {!user && (
            <div className="flex items-center gap-1 ml-2">
              <Link to="/login" className={desktopLinkClass(isActive('/login'))}>
                <KeyRound size={16} /> Login
              </Link>
              <Link to="/signup" className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition duration-200 hover:scale-[1.02]">
                <UserPlus size={16} /> Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition duration-200"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={22} /> : (
            <div className="w-5 h-5 flex flex-col justify-center gap-1">
              <span className="block w-5 h-0.5 bg-gray-600" />
              <span className="block w-5 h-0.5 bg-gray-600" />
              <span className="block w-5 h-0.5 bg-gray-600" />
            </div>
          )}
        </button>
      </nav>

      {/* Mobile Overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/40 z-40 transition-opacity duration-200 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={closeMobileMenu}
      />

      {/* Mobile Drawer */}
      <div className={`lg:hidden fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-white border-l border-gray-200 z-50 transform transition-transform duration-300 shadow-2xl ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Drawer Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="ChefMate Logo" className="h-7 w-auto" />
            <span className="text-base font-semibold text-gray-800">ChefMate</span>
          </div>
          <button onClick={closeMobileMenu} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition duration-200" aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-4 space-y-1 overflow-y-auto h-full pb-20">
          {user && (
            <div className="mb-4 p-3 rounded-lg bg-gray-50 border border-gray-200">
              <p className="text-sm font-medium text-gray-800 flex items-center gap-2"><User size={16} className="text-orange-500" /> Hi, {user?.name || 'Chef'}!</p>
              <p className="text-xs text-gray-500 mt-0.5">Welcome back to ChefMate</p>
            </div>
          )}

          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} className={mobileLinkClass(isActive(to))} onClick={closeMobileMenu}>
              <Icon size={18} /><span>{label}</span>
            </Link>
          ))}

          <div className="pt-3 mt-3 border-t border-gray-100">
            {user ? (
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition duration-200">
                <LogOut size={18} /><span>Logout</span>
              </button>
            ) : (
              <div className="space-y-1">
                <Link className={mobileLinkClass(isActive('/login'))} to="/login" onClick={closeMobileMenu}>
                  <KeyRound size={18} /><span>Login</span>
                </Link>
                <Link className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 transition duration-200" to="/signup" onClick={closeMobileMenu}>
                  <UserPlus size={18} /><span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}