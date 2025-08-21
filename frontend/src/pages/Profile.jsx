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
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-primary/20 max-w-2xl w-full">
        
        {/* User Info */}
        <div className="text-center border-b pb-6 mb-6">
          <h2 className="text-3xl font-bold mb-2 text-primary">
            Welcome, {user?.name}
          </h2>
          <p className="text-gray-600">Email: {user?.email}</p>
        </div>

        {/* Saved Recipes Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-primary">
            Your Saved Recipes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Placeholder cards – replace with dynamic data later */}
            <div className="bg-secondary p-4 rounded-lg shadow-sm border border-primary/10">
              <h4 className="font-medium text-accent">Spaghetti Carbonara</h4>
              <p className="text-sm text-gray-600">Italian • 20 min</p>
            </div>
            <div className="bg-secondary p-4 rounded-lg shadow-sm border border-primary/10">
              <h4 className="font-medium text-accent">Avocado Salad</h4>
              <p className="text-sm text-gray-600">Healthy • 10 min</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleLogout}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-accent transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
