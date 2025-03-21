import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(localStorage.getItem("userId"));
  const navigate = useNavigate();

  useEffect(() => {
    setUser(localStorage.getItem("userId"))
    if (!user || user=="undefined"||user=="null" ) {
      axiosInstance
        .get("/auth/check-session/")
        .then((res) => {
          setUser(res.data.id);
          localStorage.setItem("userId", res.data.id);
        })
        .catch(() => {
          setUser(null);
          localStorage.removeItem("userId");
          navigate("/login"); // Redirect to login if session is invalid
        });
    }
  }, [user, navigate]);

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout/"); 
    } catch (error) {
      console.error("Logout failed", error);
    }
    setUser(null);
    localStorage.removeItem("userId");
    navigate("/login");

  };
  
  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
