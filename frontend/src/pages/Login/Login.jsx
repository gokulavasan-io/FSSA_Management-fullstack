import { useEffect, useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { Button, Card } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const LoginPage = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(localStorage.getItem("userId")); 
  const [loading, setLoading] = useState(!userId); 

  useEffect(() => {
    if (userId&&userId!="undefined"&&userId!="null") {
      navigate("/"); // Redirect to dashboard if already logged in
      return;
    }

    const checkSession = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/auth/check-session/");
        if(!res.data.id) return;
        setUserId(res.data.id);
        localStorage.setItem("userId",res.data.id)
        navigate("/"); // Redirect if session is valid
      } catch (error) {
        console.log("Session check failed:", error.response?.status);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [userId, navigate]); 

  const handleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    try {
      const res = await axiosInstance.post("/auth/google/", { token });
      setUserId(res.data.id);
      localStorage.setItem("userId", res.data.id);
      navigate("/"); // Redirect after successful login
    } catch (error) {
      console.error("Login failed:", error.response?.data);
    }
  };

  return (
    <GoogleOAuthProvider clientId="113196780562-bu0lqo92v9ap0b5tbnnhhgbf00m68tsf.apps.googleusercontent.com">
      <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
        {loading ? (
          <p>Loading...</p>
        ) : userId ? (
          <Card style={{ padding: "10px", textAlign: "center" }}>
            <p>You are logged !</p>
          </Card>
        ) : (
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => console.log("Login Failed")}
            render={(renderProps) => (
              <Button
                type="primary"
                icon={<GoogleOutlined />}
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                style={{
                  backgroundColor: "#4285F4",
                  borderColor: "#4285F4",
                  color: "white",
                  fontSize: "16px",
                  padding: "10px 20px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Sign in with Google
              </Button>
            )}
          />
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
