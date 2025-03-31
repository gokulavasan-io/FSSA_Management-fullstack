import { useEffect, useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { Button, Card, Typography, Spin } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { login, fetchUserId } from "../../api/AuthAPI";

const { Title, Text } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [loading, setLoading] = useState(!userId);

  useEffect(() => {
    if (userId && userId !== "undefined" && userId !== "null") {
      navigate("/"); // Redirect to dashboard if already logged in
      return;
    }

    const checkSession = async () => {
      setLoading(true);
      try {
        const res = await fetchUserId();
        if (!res.id) return;
        setUserId(res.id);
        localStorage.setItem("userId", res.id);
        navigate("/");
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
      const res = await login(token);
      setUserId(res.id);
      localStorage.setItem("userId", res.id);
      navigate("/"); // Redirect after successful login
    } catch (error) {
      console.error("Login failed:", error.response?.data);
    }
  };

  return (
    <GoogleOAuthProvider clientId="113196780562-bu0lqo92v9ap0b5tbnnhhgbf00m68tsf.apps.googleusercontent.com">
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f0f2f5" }}>
        <Card style={{ width: 400, textAlign: "center", padding: 30, borderRadius: 8, boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}>
          {loading ? (
            <Spin size="large" />
          ) : userId ? (
            <>
              <Title level={3}>Welcome back, Coach!</Title>
              <Text type="secondary">You are already logged in.</Text>
            </>
          ) : (
            <>
              <Title level={3}>Welcome, Coach!</Title>
              <Text type="secondary">To continue with Toodle, please log in.</Text>
              <div style={{ marginTop: 20 }}>
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
                        marginTop: 20,
                        width: "100%",
                        borderRadius: 5,
                      }}
                    >
                      Sign in with Google
                    </Button>
                  )}
                />
              </div>
            </>
          )}
        </Card>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
