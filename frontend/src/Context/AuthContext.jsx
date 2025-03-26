import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserId, logout as apiLogout } from "../api/AuthAPI"; // Renaming imported logout

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(localStorage.getItem("userId"));
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");

    if (!storedUserId || storedUserId === "undefined" || storedUserId === "null") {
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
    } else {
      setUser(storedUserId);
    }
  }, [navigate]); 

  const handleLogout = async () => {
    try {
      await apiLogout(); 
    } catch (error) {
      console.error("Logout failed", error);
    }
    setUser(null);
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
