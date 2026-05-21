import { Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../contexts/AuthContext";
import logo from "../assets/chefmate-logo.png";
import { Home, Bookmark, Menu, User, LogOut, KeyRound, UserPlus, X, ChefHat, Sparkles } from 'lucide-react';

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
    `flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
      active
        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30'
        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
    }`;

  const mobileLinkClass = (active) =>
    `w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-base font-semibold transition-all duration-200 ${
      active
        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30'
        : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="bg-white/90 backdrop-blur-xl border-b border-gray-200/80 px-6 py-4 flex justify-between items-center fixed top-0 left-0 w-full z-50 shadow-lg"
      >
        {/* Logo */}
        <Link to="/app" className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200 group" onClick={closeMobileMenu}>
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <img src={logo} alt="ChefMate Logo" className="h-10 w-auto" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
          <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent tracking-tight">ChefMate</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-3">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <motion.div key={to} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to={to} className={desktopLinkClass(isActive(to))}>
                <Icon size={18} strokeWidth={2.5} /> {label}
              </Link>
            </motion.div>
          ))}

          {user && (
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-300">
              <span className="hidden xl:flex items-center gap-2.5 text-sm text-gray-700 font-semibold">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                  {(user?.name || 'C')[0].toUpperCase()}
                </div>
                Hi, {user?.name || 'Chef'}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
              >
                <LogOut size={18} strokeWidth={2.5} /> Logout
              </motion.button>
            </div>
          )}

          {!user && (
            <div className="flex items-center gap-3 ml-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/login" className={desktopLinkClass(isActive('/login'))}>
                  <KeyRound size={18} strokeWidth={2.5} /> Login
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/signup" className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:from-orange-600 hover:to-orange-700 transition-all duration-200">
                  <UserPlus size={18} strokeWidth={2.5} /> Sign Up
                </Link>
              </motion.div>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleMobileMenu}
          className="lg:hidden p-2.5 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
        </motion.button>
      </motion.nav>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={closeMobileMenu}
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="lg:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white border-l border-gray-200 z-50 shadow-2xl"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-orange-50 to-amber-50">
              <div className="flex items-center gap-3">
                <img src={logo} alt="ChefMate Logo" className="h-9 w-auto" />
                <span className="text-lg font-bold text-gray-900 tracking-tight">ChefMate</span>
              </div>
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={closeMobileMenu} 
                className="p-2 rounded-xl text-gray-600 hover:bg-white/50 transition-all duration-200" 
                aria-label="Close menu"
              >
                <X size={22} strokeWidth={2.5} />
              </motion.button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 space-y-3 overflow-y-auto h-full pb-24">
              {user && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-base font-bold shadow-lg">
                      {(user?.name || 'C')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-base font-bold text-gray-900">Hi, {user?.name || 'Chef'}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Sparkles size={12} className="text-orange-500" />
                        Welcome back
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {NAV_LINKS.map(({ to, label, icon: Icon }, index) => (
                <motion.div
                  key={to}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Link to={to} className={mobileLinkClass(isActive(to))} onClick={closeMobileMenu}>
                    <Icon size={22} strokeWidth={2.5} /><span>{label}</span>
                  </Link>
                </motion.div>
              ))}

              <div className="pt-5 mt-5 border-t border-gray-200">
                {user ? (
                  <motion.button 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                    onClick={handleLogout} 
                    className="w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-base font-semibold text-gray-700 hover:bg-gray-100 transition-all duration-200"
                  >
                    <LogOut size={22} strokeWidth={2.5} /><span>Logout</span>
                  </motion.button>
                ) : (
                  <div className="space-y-3">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      <Link className={mobileLinkClass(isActive('/login'))} to="/login" onClick={closeMobileMenu}>
                        <KeyRound size={22} strokeWidth={2.5} /><span>Login</span>
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Link className="w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-base font-bold bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:from-orange-600 hover:to-orange-700 transition-all duration-200" to="/signup" onClick={closeMobileMenu}>
                        <UserPlus size={22} strokeWidth={2.5} /><span>Sign Up</span>
                      </Link>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}