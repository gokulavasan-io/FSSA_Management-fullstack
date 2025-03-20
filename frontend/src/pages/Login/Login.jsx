import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { Button } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import axios from "axios";

const LoginPage = () => {
  const handleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    try {
      const res = await axios.post(
        "http://localhost:8000/auth/google/",
        { token },
        { withCredentials: true }
      );
      console.log("Login successful:", res.data);
      // Navigate to dashboard after login
    } catch (error) {
      console.error("Login failed:", error.response?.data);
    }
  };

  return (
    <>
    <GoogleOAuthProvider clientId="113196780562-bu0lqo92v9ap0b5tbnnhhgbf00m68tsf.apps.googleusercontent.com">
      <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
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
      </div>
    </GoogleOAuthProvider>
    </>
  );
};

export default LoginPage;
