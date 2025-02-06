import React from "react";
import { Button, Drawer, List, Typography } from "antd";
import { MenuOutlined, TableOutlined, ArrowRightOutlined } from "@ant-design/icons";
import LevelSection from "./levelSection.jsx";
import TestsSection from "./testsSection.jsx";
import ExportData from "../exportsData.jsx";
import { useMarksContext } from "../contextFile";
import 'antd/dist/reset.css'; 
import { TableChartOutlined } from "@mui/icons-material";
import TestButton from "./addNewTestButton.jsx";


const Sidebar = () => {
  const { setIsMainTable, sidebarOpen,setSidebarOpen} = useMarksContext();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);


  return (
    <>
      {!sidebarOpen && (
        <Button
        shape="circle"
          type="primary"
          icon={<MenuOutlined />}
          onClick={toggleSidebar}
          style={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 1000,
            backgroundColor: "#1890ff",
            borderColor: "#1890ff",
            color: "#fff",
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
        bodyStyle={{ padding: "16px" }}
      >
        <List
          bordered
          itemLayout="vertical"
          style={{ padding: 0 }}
        >
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

          <TestButton />


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

export default Sidebar;
