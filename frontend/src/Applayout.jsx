import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "./pages/Topbar_and_Sidebar/Sidebar/Sidebar";
import TopBar from "./pages/Topbar_and_Sidebar/Topbar/Topbar";
import { useState } from "react";

const { Content } = Layout;

function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Layout */}
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 240, // Sidebar width
          transition: "margin-left 0.3s ease-in-out",
        }}
      >
        {/* TopBar */}
        <TopBar collapsed={collapsed}/>

        {/* Content */}
        <Content
          style={{
            marginTop: 64, // Prevents overlap with TopBar
            padding: "20px",
            minHeight: "calc(100vh - 64px)",
            background: "#f5f5f5",
            transition: "all 0.3s ease-in-out",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default AppLayout;
