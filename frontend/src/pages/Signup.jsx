import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Bot, Bookmark, ChefHat, Lightbulb, Lock, LogIn, Mail, Rocket, ShieldCheck, Smartphone, Sparkles, User, XCircle } from "lucide-react";

export default function Signup() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);
    try {
        
          const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
          const res = await axios.post(`${API_BASE_URL}/api/auth/signup`, form);
          const userId = res.data.user.id;

          login(res.data.user, res.data.token);

          // Initialize authenticated usage
          localStorage.setItem(`chefmate_usage_${userId}`, "0");
          localStorage.setItem(
            `chefmate_usage_date_${userId}`,
            new Date().toDateString()
          );

          navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-12 px-4 mt-20">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">
            Join the Kitchen
          </h1>
          <p className="text-base text-gray-600">Start your culinary journey today!</p>
        </div>

        {/* Signup Form */}
        <form 
          onSubmit={handleSubmit} 
          className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-200 space-y-5"
        >
          <h2 className="text-xl font-semibold text-center text-gray-800 flex items-center justify-center gap-2">
            <Rocket size={20} className="text-orange-600" /> Create Account
          </h2>
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium flex items-center gap-2">
                <XCircle size={16} /> {error}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <User size={16} /> Full Name
              </label>
              <input
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition text-gray-700"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Mail size={16} /> Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition text-gray-700"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Lock size={16} /> Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition text-gray-700"
                required
              />
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <Lightbulb size={12} /> Use at least 6 characters with numbers & letters
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 px-5 rounded-lg font-medium transition duration-200 flex items-center justify-center gap-2 ${
              loading 
                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                : "bg-orange-500 text-white hover:bg-orange-600 hover:scale-[1.02]"
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                Creating Account...
              </>
            ) : (
              <>
                <Sparkles size={18} /> Create Account
              </>
            )}
          </button>

          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="font-medium text-orange-600 hover:text-orange-700 underline"
              >
                Sign In
              </Link>
            </p>
          </div>

          {/* Additional info */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700 text-center flex items-center justify-center gap-2">
              <ShieldCheck size={14} /> Your data is secure and encrypted
            </p>
          </div>
        </form>

        {/* Feature highlights */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="text-gray-600 flex flex-col items-center">
            <Bot size={20} className="mb-1 text-orange-600" />
            <p className="text-xs font-medium">AI Recipes</p>
          </div>
          <div className="text-gray-600 flex flex-col items-center">
            <Smartphone size={20} className="mb-1 text-orange-600" />
            <p className="text-xs font-medium">Easy to Use</p>
          </div>
          <div className="text-gray-600 flex flex-col items-center">
            <Bookmark size={20} className="mb-1 text-orange-600" />
            <p className="text-xs font-medium">Save Favorites</p>
          </div>
        </div>
      </div>
    </div>
  );
}