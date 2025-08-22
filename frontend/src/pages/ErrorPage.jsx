import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-6xl font-extrabold text-red-500 mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
        Oops! Page Not Found
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        The page you are looking for does not exist or has been moved.
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 rounded-2xl bg-primary text-white font-semibold hover:bg-primary/90 transition"
      >
        Go to Home
      </button>
    </div>
  );
}
