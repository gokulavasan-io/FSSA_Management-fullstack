import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(localStorage.getItem("userEmail"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      axiosInstance
        .get("/auth/check-session/")
        .then((res) => {
          setUser(res.data.email);
          localStorage.setItem("userEmail", res.data.email);
        })
        .catch(() => {
          setUser(null);
          localStorage.removeItem("userEmail");
          navigate("/login"); // Redirect to login if session is invalid
        });
    }
  }, [user, navigate]);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
