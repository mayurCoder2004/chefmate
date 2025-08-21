import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome, {user?.name}</h2>
        <p className="mb-6">Email: {user?.email}</p>
        <button onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
          Logout
        </button>
      </div>
    </div>
  );
}
