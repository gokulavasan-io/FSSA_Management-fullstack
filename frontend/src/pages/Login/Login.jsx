import { useEffect, useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { Button, Card } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import axiosInstance from "../../api/axiosInstance";

const LoginPage = () => {
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail")); // Load session from localStorage
  const [loading, setLoading] = useState(!userEmail); // If userEmail exists, no need to fetch again

  // Check if the user is already logged in (runs only once)
  useEffect(() => {
    if (userEmail) return; // Prevent unnecessary API calls if user is already logged in

    const checkSession = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/auth/check-session/");
        setUserEmail(res.data.email);
        localStorage.setItem("userEmail", res.data.email);
      } catch (error) {
        console.log("Session check failed:", error.response?.status);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [userEmail]); // Runs only once if userEmail is not set

  // Handle Google login success
  const handleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    try {
      const res = await axiosInstance.post("/auth/google/", { token });
      setUserEmail(res.data.email);
      localStorage.setItem("userEmail", res.data.email); // Store session
    } catch (error) {
      console.error("Login failed:", error.response?.data);
    }
  };

  return (
    <GoogleOAuthProvider clientId="113196780562-bu0lqo92v9ap0b5tbnnhhgbf00m68tsf.apps.googleusercontent.com">
      <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
        {loading ? (
          <p>Loading...</p>
        ) : userEmail ? (
          <Card style={{ padding: "10px", textAlign: "center" }}>
            <p>You are logged in as:</p>
            <strong>{userEmail}</strong>
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
