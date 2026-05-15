import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ChefHat, KeyRound, Lock, LogIn, Mail, Rocket, Sparkles, XCircle } from "lucide-react";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, form);
      const userId = res.data.user.id;
      const today = new Date().toDateString();

      const dateKey = `chefmate_usage_date_${userId}`;
      const usageKey = `chefmate_usage_${userId}`;

      const savedDate = localStorage.getItem(dateKey);

      if (savedDate !== today) {
        localStorage.setItem(usageKey, "0");
        localStorage.setItem(dateKey, today);
      }

      login(res.data.user, res.data.token);
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
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
            Welcome Back
          </h1>
          <p className="text-base text-gray-600">Sign in to continue cooking!</p>
        </div>

        {/* Login Form */}
        <form 
          onSubmit={handleSubmit} 
          className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-200 space-y-5"
        >
          <h2 className="text-xl font-semibold text-center text-gray-800 flex items-center justify-center gap-2">
            <KeyRound size={20} className="text-orange-600" /> Login
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
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition text-gray-700"
                required
              />
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
                Signing in...
              </>
            ) : (
              <>
                <LogIn size={18} /> Sign In
              </>
            )}
          </button>

          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link 
                to="/signup" 
                className="font-medium text-orange-600 hover:text-orange-700 underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </form>

        {/* Additional decorative element */}
        <div className="text-center opacity-60">
          <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
            <ChefHat size={16} /> Ready to cook something amazing?
          </p>
        </div>
      </div>
    </div>
  );
}