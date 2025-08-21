import React from "react";

const Footer = () => {
  return (
    <div>
      <footer className="bg-primary text-white py-10 mt-12">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          {/* Brand Section */}
          <div>
            <h2 className="text-2xl font-bold">ChefMate</h2>
            <p className="mt-2 text-gray-200">
              Discover delicious recipes, cooking tips, and healthy meal ideas –
              all in one place.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-accent">
                  Home
                </a>
              </li>
              <li>
                <a href="/recipes" className="hover:text-accent">
                  Recipes
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-accent">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-accent">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-accent">
                Facebook
              </a>
              <a href="#" className="hover:text-accent">
                Instagram
              </a>
              <a href="#" className="hover:text-accent">
                Twitter
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-600 pt-4 text-center text-gray-300">
          © {new Date().getFullYear()} ChefMate. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Footer;
