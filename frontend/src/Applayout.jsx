import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "./pages/TopbarSidebar/Sidebar/Sidebar";
import TopBar from "./pages/TopbarSidebar/Topbar/Topbar";
import { useState } from "react";

const { Content } = Layout;

function AppLayout() {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Layout style={{ minHeight: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Layout */}
      <Layout
        style={{
          marginLeft: 70,
          transition: "margin-left 0.3s ease-in-out",
          height: "100vh", // Ensure full height
          overflow: "hidden", // Prevent whole page scrolling
        }}
      >
        {/* TopBar */}
        <TopBar collapsed={collapsed} />

        {/* Content Area */}
        <Content
          style={{
            marginTop: 64,
            padding: "20px",
            height: "calc(100vh - 64px)", 
            overflowY: "auto",
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
