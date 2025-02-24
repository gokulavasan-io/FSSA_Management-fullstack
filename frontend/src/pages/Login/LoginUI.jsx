import { Button, Typography, Alert } from "antd";

const { Title } = Typography;

const LoginUI = ({ error, handleLogin,loading }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <Title level={3}> Please Login</Title>
      {error && <Alert message={error} type="error" showIcon />}
       
        <Button type="primary" size="large" loading={loading} onClick={handleLogin}>
          Login with Google
        </Button>
 
    </div>
  );
};

export default LoginUI;
