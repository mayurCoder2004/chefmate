import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  // Login: store user and token
  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("tokenTimestamp", Date.now().toString());
  };

  // Logout: clear state
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("tokenTimestamp");
  }, []);

  // Check token expiration on mount and periodically
  useEffect(() => {
    const checkTokenExpiration = () => {
      const tokenTimestamp = localStorage.getItem("tokenTimestamp");
      const storedToken = localStorage.getItem("token");
      
      if (!storedToken || !tokenTimestamp) {
        return;
      }

      // Token expires in 7 days (7 * 24 * 60 * 60 * 1000 ms)
      const TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000;
      const tokenAge = Date.now() - parseInt(tokenTimestamp, 10);

      if (tokenAge >= TOKEN_EXPIRY) {
        console.log("Token expired, logging out...");
        logout();
      }
    };

    // Check immediately
    checkTokenExpiration();

    // Check every hour
    const interval = setInterval(checkTokenExpiration, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
