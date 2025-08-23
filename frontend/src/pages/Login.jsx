import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

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
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      login(res.data.user, res.data.token);
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center py-12 px-4 relative overflow-hidden mt-20">
      {/* Background decorative elements */}
      <div className="fixed top-0 left-0 w-80 h-80 bg-gradient-to-br from-orange-300/10 to-amber-300/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-yellow-300/10 to-orange-300/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
      
      {/* Floating elements */}
      <div className="fixed top-20 right-20 w-4 h-4 bg-orange-400/40 rounded-full animate-float"></div>
      <div 
        className="fixed bottom-32 left-16 w-6 h-6 bg-amber-400/40 rounded-full animate-float"
        style={{ animationDelay: "2s" }}
      ></div>
      <div 
        className="fixed top-1/2 left-10 w-3 h-3 bg-yellow-400/40 rounded-full animate-float"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-2 drop-shadow-lg">
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
              Welcome Back
            </span>
            <span className="text-3xl ml-2 inline-block animate-bounce">👋</span>
          </h1>
          <p className="text-lg text-orange-700/80 font-medium">
            Sign in to continue cooking! ✨
          </p>
        </div>

        {/* Login Form */}
        <form 
          onSubmit={handleSubmit} 
          className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-orange-200/50 space-y-6 group hover:shadow-3xl transition-all duration-500 overflow-hidden"
        >
          {/* Pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22%23f97316%22 fill-opacity=%220.03%22%3E%3Cpath d=%22m0 40l40-40h-40v40zm40 0v-40h-40l40 40z%22/%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-center text-orange-700 mb-6 flex items-center justify-center gap-2">
              🔐 Login
            </h2>
            
            {error && (
              <div className="mb-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl animate-shake">
                <p className="text-red-700 font-semibold flex items-center gap-2">
                  ❌ {error}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-orange-700 mb-2 flex items-center gap-2">
                  📧 Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border-2 border-orange-200/50 rounded-2xl px-4 py-3 outline-none focus:ring-4 focus:ring-orange-200/50 focus:border-orange-400 transition-all duration-300 bg-white/80 backdrop-blur-sm text-gray-700 placeholder-orange-300 shadow-inner"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-orange-700 mb-2 flex items-center gap-2">
                  🔒 Password
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border-2 border-orange-200/50 rounded-2xl px-4 py-3 outline-none focus:ring-4 focus:ring-orange-200/50 focus:border-orange-400 transition-all duration-300 bg-white/80 backdrop-blur-sm text-gray-700 placeholder-orange-300 shadow-inner"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 text-lg flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Signing in...
                </>
              ) : (
                <>
                  ✨ Sign In
                </>
              )}
            </button>

            <div className="mt-6 text-center">
              <p className="text-orange-700/80 font-medium">
                Don't have an account?{" "}
                <Link 
                  to="/signup" 
                  className="font-bold text-orange-600 hover:text-amber-600 underline decoration-2 underline-offset-4 hover:decoration-amber-600 transition-all duration-300"
                >
                  Create Account 🚀
                </Link>
              </p>
            </div>
          </div>
        </form>

        {/* Additional decorative element */}
        <div className="text-center mt-8 opacity-60">
          <p className="text-orange-600/60 text-sm font-medium">
            🍳 Ready to cook something amazing?
          </p>
        </div>
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(180deg);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-2px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(2px);
          }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}