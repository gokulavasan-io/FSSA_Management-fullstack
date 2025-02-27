import { useState } from "react";
import { auth, provider, signInWithPopup } from "../../api/firebaseAuth"; // import from firebaseAuth.js
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoginUI from "./LoginUI";

const Login = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();
      
      const response = await axios.post("http://127.0.0.1:8000/member/verify/", {
        token: idToken,
      });
  
      if (response.status === 200 && response.data.message === "Token verified and member authenticated.") {
        alert("Login Successful");
        localStorage.setItem("userId",response.data.member.id);
        localStorage.setItem("pictureLink",response.data.picture);
        navigate("/");
      } else {
        alert("You are not a registered member.");
      }
    } catch (e) {
      console.error("Login Failed:", e);
  
      if (e.code) {
        setError(`Firebase Error: ${e.code} - ${e.message}`);
      } else if (e.response?.data?.error) {
        setError(`Backend Error: ${e.response.data.error}`);
      } else {
        setError("Login Failed. Please try again.");
      }
    }finally {
      setLoading(false);
    }
  };

  return (
    <LoginUI handleLogin={handleLogin} error={error} loading={loading} />
  );
};

export default Login;
