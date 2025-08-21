import { Link } from "react-router-dom";
import logo from "../assets/chefmate-logo.png"; // Make sure your logo image is in this path

export default function Navbar() {
  return (
    <nav className="bg-[#F9F6F0] p-4 flex justify-between items-center shadow-md fixed top-0 left-0 w-full z-50">
      {/* Logo */}
      <div className="flex items-center">
        <img src={logo} alt="ChefMate Logo" className="h-10 w-auto" />
      </div>

      {/* Navigation Links */}
      <div className="space-x-4">
        <Link className="text-gray-800 hover:text-gray-600" to="/">Home</Link>
        <Link className="text-gray-800 hover:text-gray-600" to="/login">Login</Link>
        <Link className="text-gray-800 hover:text-gray-600" to="/signup">Signup</Link>
        <Link className="text-gray-800 hover:text-gray-600" to="/profile">Profile</Link>
      </div>
    </nav>
  );
}
