import React from "react";
import { Heart, ArrowRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-12">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Brand */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">ChefMate</h2>
          <p className="text-sm text-gray-400 leading-relaxed mb-5">
            Discover delicious recipes, cooking tips, and healthy meal ideas — all in one place.
          </p>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-2">Stay updated with new recipes!</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email..."
                className="flex-1 px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
              <button className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {[
              { label: 'Home', href: '/' },
              { label: 'Recipes', href: '/recipes' },
              { label: 'About', href: '#' },
              { label: 'Contact', href: '#' },
            ].map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="text-sm text-gray-400 hover:text-orange-400 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight size={13} /> {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-4">Follow Us</h3>
          <div className="space-y-3">
            {[
              { label: 'Facebook', href: '#' },
              { label: 'Instagram', href: '#' },
              { label: 'Twitter', href: '#' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-orange-400 transition-colors"
              >
                <span className="w-7 h-7 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-xs font-bold text-orange-500">
                  {label[0]}
                </span>
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-5xl mx-auto px-6 mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
        <p>© {new Date().getFullYear()} ChefMate. All rights reserved.</p>
        <p className="flex items-center gap-1.5">
          Made with <Heart size={12} className="text-orange-500" /> for food lovers everywhere
        </p>
      </div>
    </footer>
  );
};

export default Footer;