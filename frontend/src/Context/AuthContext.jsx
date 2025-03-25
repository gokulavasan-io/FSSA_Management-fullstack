import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { fetchUserId,logout } from "../api/AuthAPI";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(localStorage.getItem("userId"));
  const navigate = useNavigate();

  useEffect(() => {
    setUser(localStorage.getItem("userId"))
    if (!user || user=="undefined"||user=="null" ) {
      const fetchUser = async () => {
        try {
          let res = await fetchUserId();
          if (res?.id) {
            setUser(res.id);
            localStorage.setItem("userId", res.id);
          } else {
            throw new Error("Invalid user data");
          }
        } catch (error) {
          setUser(null);
          localStorage.removeItem("userId");
          navigate("/login");
        }
      };

      fetchUser();

    }
  }, [user, navigate]);

  const logout = async () => {
    try {
      await logout()
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
