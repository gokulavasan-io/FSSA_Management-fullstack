import React from "react";
import { Button, Drawer, List, Typography } from "antd";
import { MenuOutlined, } from "@ant-design/icons";
import LevelSection from "./LevelSection.jsx";
import TestsSection from "./TestSection.jsx";
import ExportData from "../ExportData.jsx";
import { useMarksContext } from "../../../../Context/MarksContext.jsx";
import "antd/dist/reset.css";
import { TableChartOutlined } from "@mui/icons-material";
import AddNewTest from "../AddNewTest/AddNewTest.jsx";

const TestDetailSideBar = () => {
  const { setIsMainTable, sidebarOpen, setSidebarOpen } = useMarksContext();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <>
      {!sidebarOpen && (
        <Button
          shape="circle"
          type="text" // Removes background and border
          icon={<MenuOutlined style={{ fontSize: "18px", color: "#000" }} />} // Adjust color & size
          onClick={toggleSidebar}
          style={{
            position:"fixed",
            top:"80px",
            right:"30px",
          }}
        />
      )}

      {/* Sidebar Drawer */}
      <Drawer
        title={<Typography.Text strong>Tests</Typography.Text>}
        placement="right"
        closable
        onClose={toggleSidebar}
        open={sidebarOpen}
        bodyStyle={{
          padding: "16px",
          height: "calc(100vh - 68px)",
          overflowY: "auto",
        }} // Height adjusted to fit content
        style={{
          position: "absolute",
          top: "68px",
          right: 0,
          height: "calc(100vh - 68px)",
          borderRadius: "16px 0 0 16px",
        }}
        maskStyle={{ backgroundColor: "rgba(0, 0, 0, .09)" }}
      >
        <List bordered itemLayout="vertical" style={{ padding: 0 }}>
          {/* Average Table Button */}
          <List.Item>
            <Button
              type="primary"
              onClick={() => setIsMainTable(true)}
              style={{
                width: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <TableChartOutlined style={{ fontSize: "18px" }} />
              <span>Average Table</span>
            </Button>
          </List.Item>

          <AddNewTest />

          {/* Marks Section */}
          <List.Item>
            <Typography.Text strong>Levels</Typography.Text>
          </List.Item>
          <LevelSection />

          <List.Item>
            <Typography.Text strong>Tests</Typography.Text>
          </List.Item>
          <TestsSection />

          <List.Item>
            <ExportData />
          </List.Item>
        </List>
      </Drawer>
    </>
  );
};

export default TestDetailSideBar;
