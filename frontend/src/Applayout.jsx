import React, { useState } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "./pages/TopbarSidebar/Sidebar/Sidebar";
import TopBar from "./pages/TopbarSidebar/Topbar/Topbar";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./pages/Components/ErrorFallback";
import { MainContextProvider } from "./Context/MainContext";
import GeneralFetchComponent from "./pages/Components/GeneralFetch";

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
          height: "100vh", 
          overflow: "hidden", 
        }}
      >
        {/* TopBar */}
        <TopBar collapsed={collapsed} />

        {/* Content Area */}

          <Content
            style={{
              marginTop: 60,
              padding: "20px",
              height: "calc(100vh - 60px)",
              overflowY: "auto",
              background: "#ebeff3",
              transition: "all 0.3s ease-in-out",
            }}
          >
            <ErrorBoundary FallbackComponent={ErrorFallback}>
            <MainContextProvider>
              <GeneralFetchComponent />
              <Outlet />
            </MainContextProvider>
            </ErrorBoundary>
          </Content>
      </Layout>
    </Layout>
  );
}

export default AppLayout;
