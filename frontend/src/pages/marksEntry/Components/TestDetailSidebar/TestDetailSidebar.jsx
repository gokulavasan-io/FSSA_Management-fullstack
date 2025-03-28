import React from "react";
import { Button, Drawer, List, Typography } from "antd";
import { MenuOutlined, } from "@ant-design/icons";
import TestDetailSection from "./TestDetailSection.jsx";
import { useMarksContext } from "../../../../Context/MarksContext.jsx";
import "antd/dist/reset.css";
import { TableChartOutlined } from "@mui/icons-material";
import { FwButton } from "@freshworks/crayons/react";


const TestDetailSideBar = () => {
  const { setIsMainTable, sidebarOpen, setSidebarOpen,subjectName } = useMarksContext();

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
          borderRadius: "4px 0 0 4px",
        }}
        maskStyle={{ backgroundColor: "rgba(0, 0, 0, .09)" }}
      >
        <List bordered itemLayout="vertical" style={{ padding: 0 }}>
          {/* Average Table Button */}
          <List.Item>
            <FwButton
              color="primary"
              onFwClick={() => setIsMainTable(true)}
            >
              <TableChartOutlined style={{ fontSize: "18px",marginRight:10 }} />
              <span>Average Table</span>
            </FwButton>
          </List.Item>

          {/* Marks Section */}
          {subjectName=="Problem Solving"&&
        
           <>
            <List.Item>
              <Typography.Text strong>Levels</Typography.Text>
            </List.Item>
            <TestDetailSection   isLevelSection={true}  />
            </>
          }
     

          <List.Item>
            <Typography.Text strong>Tests</Typography.Text>
          </List.Item>
          <TestDetailSection  isLevelSection={false}  />


        </List>
      </Drawer>
    </>
  );
};

export default TestDetailSideBar;
