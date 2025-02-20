import { useState } from "react";
import { auth, provider, signInWithPopup } from "../../api/firebaseAuth"; // import from firebaseAuth.js
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useMainContext } from "../../Context/MainContext";

const LoginPage = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const {setUserName,setUserMailId,setSectionName,setSectionId,setUserId,setUserRole } = useMainContext();


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
        console.log(response.data);
  
        let userData = response.data;
        setUserId(userData.member.id);
        setUserName(userData.member.name);
        setSectionId(userData.member.section.id);
        setSectionName(userData.member.section.name);
        setUserRole(userData.member.role.name);
  
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
    }
  };
  

  return (
    <div style={{display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", flexDirection:"column"}}>
      <h2>Please Login</h2>
      {error && <p>{error}</p>}
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};

export default LoginPage;
