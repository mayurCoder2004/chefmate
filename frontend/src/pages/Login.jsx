import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      login(res.data.user, res.data.token);
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-secondary">
      <form 
        onSubmit={handleSubmit} 
        className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-primary/20"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-primary">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="block mb-4 p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="block mb-6 p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <button
          type="submit"
          className="w-full bg-primary text-white p-3 rounded-lg hover:bg-accent transition"
        >
          Login
        </button>

        <p className="mt-4 text-center text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-primary font-semibold hover:text-accent">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}
