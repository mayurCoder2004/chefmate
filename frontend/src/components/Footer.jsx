import React from "react";

const Footer = () => {
  return (
    <div>
      <footer className="relative bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-600 text-white py-16 mt-16 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-yellow-400/20 to-orange-400/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating elements */}
        <div className="absolute top-20 right-32 w-4 h-4 bg-orange-300/50 rounded-full animate-float"></div>
        <div className="absolute bottom-32 left-20 w-6 h-6 bg-amber-300/50 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-16 w-3 h-3 bg-yellow-300/50 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>

        {/* Pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23fbbf24\' fill-opacity=\'0.1\'%3E%3Cpath d=\'m0 60l60-60h-60v60zm60 0v-60h-60l60 60z\'/%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 px-6 relative z-10">
          {/* Brand Section */}
          <div className="group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-400 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h2 className="text-3xl font-bold group-hover:text-orange-200 transition-colors duration-300">ChefMate</h2>
            </div>
            <p className="mt-4 text-orange-100 leading-relaxed text-lg group-hover:text-white transition-colors duration-300">
              Discover <span className="text-yellow-200 font-semibold">delicious recipes</span>, cooking tips, and healthy meal ideas –
              all in one place.
            </p>
            
            {/* Newsletter signup */}
            <div className="mt-6 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-orange-300/30">
              <p className="text-orange-100 text-sm mb-3 font-medium">Stay updated with new recipes!</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email..."
                  className="flex-1 px-3 py-2 bg-white/20 backdrop-blur-sm border border-orange-300/50 rounded-lg text-white placeholder-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="group">
            <h3 className="text-2xl font-bold mb-6 group-hover:text-orange-200 transition-colors duration-300">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <a href="/" className="flex items-center gap-3 text-orange-100 hover:text-yellow-200 transition-all duration-300 group/link text-lg font-medium">
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Home
                </a>
              </li>
              <li>
                <a href="/recipes" className="flex items-center gap-3 text-orange-100 hover:text-yellow-200 transition-all duration-300 group/link text-lg font-medium">
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Recipes
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-3 text-orange-100 hover:text-yellow-200 transition-all duration-300 group/link text-lg font-medium">
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  About
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-3 text-orange-100 hover:text-yellow-200 transition-all duration-300 group/link text-lg font-medium">
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="group">
            <h3 className="text-2xl font-bold mb-6 group-hover:text-orange-200 transition-colors duration-300">Follow Us</h3>
            <div className="space-y-4">
              <a href="#" className="flex items-center gap-4 text-orange-100 hover:text-yellow-200 transition-all duration-300 group/social text-lg font-medium">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover/social:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                Facebook
              </a>
              <a href="#" className="flex items-center gap-4 text-orange-100 hover:text-yellow-200 transition-all duration-300 group/social text-lg font-medium">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg group-hover/social:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                Instagram
              </a>
              <a href="#" className="flex items-center gap-4 text-orange-100 hover:text-yellow-200 transition-all duration-300 group/social text-lg font-medium">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover/social:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </div>
                Twitter
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-orange-400/30 pt-8 text-center text-orange-100 relative z-10">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-orange-300"></div>
            <svg className="w-6 h-6 text-orange-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-orange-300"></div>
          </div>
          <p className="text-lg font-medium">
            © {new Date().getFullYear()} <span className="text-yellow-200 font-bold">ChefMate</span>. All rights reserved.
          </p>
          <p className="text-orange-200 mt-2">Made with ❤️ for food lovers everywhere</p>
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { 
              transform: translateY(0px) rotate(0deg); 
              opacity: 0.5;
            }
            50% { 
              transform: translateY(-15px) rotate(180deg); 
              opacity: 1;
            }
          }
          
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
        `}</style>
      </footer>
    </div>
  );
};

export default Footer;