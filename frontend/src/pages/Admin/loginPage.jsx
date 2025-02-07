import { useState } from "react";
import { auth, provider, signInWithPopup } from "../../api/firebaseAuth"; // import from firebaseAuth.js
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = ({setIsLoggedIn}) => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();
      const response = await axios.post("http://127.0.0.1:8000/member/verify/", {
        token: idToken,
      });

      if (response.status === 200 && response.data.message === "Token verified and member authenticated.") {
        alert("Login Successful");
        navigate("/mark");
        setIsLoggedIn(true)
      } else {
        alert("You are not a registered member.");
      }

    } catch (e) {

      if (e.response?.data?.error) {
        setError(e.response.data.error);  
      }
      else{
        setError("Login Failed. Please try again.");
      }
      console.error(error);
    }
  };

  return (
    <div style={{display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", flexDirection:"column"}}>
      <h2>Login</h2>
      {error && <p>{error}</p>}
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};

export default LoginPage;
