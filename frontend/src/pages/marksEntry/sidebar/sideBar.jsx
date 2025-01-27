import React, { useState } from "react";
import API_PATHS from "../../../constants/apiPaths";
import axios from "axios";
import TestsSection from "./testsSection";
import ExportData from "../exportsData.jsx";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
  Typography,
  IconButton,
  Add,
  Menu,
  TableChartRounded,
  ArrowForwardIos,
} from "../../../utils/materialImports.js";
import LevelSection from "./levelSection.jsx";

const Sidebar = (props) => {
  const {
    onOptionClick,
    testDetails,
    setTestDetails,
    setIsMainTable,
  } =props;


  const [sidebarOpen, setSidebarOpen] = useState(false); 

  // Toggles sidebar visibility
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);



  return (
    <>
      {/* Floating Button to Open Sidebar */}
      {!sidebarOpen && (
        <IconButton
          onClick={toggleSidebar}
          sx={{
            position: "fixed",
            top: 16,
            right: 16, // Ensures button is on the right side
            backgroundColor: "#1976d2",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#115293",
            },
          }}
        >
          <Menu />
        </IconButton>
      )}

      {/* Sidebar Drawer */}
      <Drawer
        sx={{
          "& .MuiDrawer-paper": {
            width: 200,
            boxSizing: "border-box",
            backgroundColor: "#f9f9f9",
            padding: "16px",
            borderLeft: "1px solid #ddd",
          },
        }}
        anchor="right" // Ensures the sidebar opens on the right side
        open={sidebarOpen} // Sidebar visibility controlled by state
        onClose={toggleSidebar} // Close when toggled
        BackdropProps={{ invisible: true }}
      >
        {/* Close Button Inside Sidebar */}
        <IconButton
          onClick={toggleSidebar}
          sx={{
            position: "absolute",
            top: 8,
            right: 8, // Close button in the top-right corner inside sidebar
            backgroundColor: "#1976d2",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#115293",
            },
          }}
        >
          <ArrowForwardIos />
        </IconButton>

        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            marginTop: 4,
            marginBottom: 2,
            color: "#555",
          }}
        >
          Tests
        </Typography>
        <List>

          {/* mainTable Button */}
          <ListItem sx={{ justifyContent: "center", marginBottom: 0 }}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<TableChartRounded />}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                padding: "10px 20px",
                borderRadius: "5px",
              }}
              onClick={() => {
                setIsMainTable(true);
              }}
            >
              Average Table
            </Button>
          </ListItem>
          {/* New Button */}
          <ListItem sx={{ justifyContent: "center", marginBottom: 1 }}>
            <Button
              variant="contained"
              color="success"
              startIcon={<Add />}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                padding: "10px 20px",
                borderRadius: "5px",
              }}
              onClick={() => {
                onOptionClick(null);
              }}
            >
              New
            </Button>
          </ListItem>

          {/* Marks Section */}
          <ListItem
            sx={{
              backgroundColor: "#e3f2fd",
              borderRadius: "8px",
              marginBottom: 1,
            }}
          >
            <ListItemText
              primary="Levels"
              sx={{ fontWeight: "bolder", color: "#333" }}
            />
          </ListItem>
          <LevelSection
            testDetails={testDetails}
            onOptionClick={onOptionClick}
            target="levels"
          />

          {/* Marks Section */}
          <ListItem
            sx={{
              backgroundColor: "#e3f2fd",
              borderRadius: "8px",
              marginBottom: 1,
            }}
          >
            <ListItemText
              primary="Tests"
              sx={{ fontWeight: "bolder", color: "#333" }}
            />
          </ListItem>
          <TestsSection
            testDetails={testDetails}
            onOptionClick={onOptionClick}
            target="marks"
          />

         

         

<ListItem sx={{ justifyContent: "center", marginBottom: 0 }}>
          <ExportData  {...props} />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
