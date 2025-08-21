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
      login(res.data.user, res.data.token); // ✅ pass both user and token
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="max-w-md w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange}
          className="block mb-4 p-3 w-full border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"/>
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange}
          className="block mb-6 p-3 w-full border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"/>

        <button type="submit" className="w-full bg-purple-600 text-white p-3 rounded hover:bg-purple-700 transition">Login</button>

        <p className="mt-4 text-center text-gray-600">
          Don't have an account? <Link to="/signup" className="text-purple-600 font-semibold">Signup</Link>
        </p>
      </form>
    </div>
  );
}
