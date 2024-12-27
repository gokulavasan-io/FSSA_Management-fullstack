import React, { useState } from "react";
import API_PATHS from "../../../constants/apiPaths";
import axios from "axios";
import TestsSection from "./testsSection";

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
  Archive,
  TableChartRounded,
  ArrowForwardIos,
} from "../../../utils/materialImports.js";

const Sidebar = ({
  onOptionClick,
  testDetails,
  setTestDetails,
  setIsMainTable,
  setIsArchivedStatusChanged,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar visibility

  // Toggles sidebar visibility
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Handle dropping a test into the Archived section
  const handleDrop = (item, target) => {
    // If dropped into Archived section, mark as archived
    if (target === "archived") {
      item.isArchived = true;
    } else {
      item.isArchived = false;
    }

    setTestDetails((prevDetails) =>
      prevDetails.map((test) =>
        test.id === item.id
          ? {
              ...test,
              test_detail: { ...test.test_detail, isArchived: item.isArchived },
            }
          : test,
      ),
    );

    axios
      .put(`${API_PATHS.UPDATE_ARCHIVE}${item.id}/`, {
        isArchived: item.isArchived,
      })
      .then((response) => {
        console.log("Marks data updated successfully!", response.data);
        setIsArchivedStatusChanged(true);
      })
      .catch((error) => {
        console.error("Error submitting marks data:", error.message);
      });
  };

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
          <ListItem sx={{ justifyContent: "center", marginBottom: 2 }}>
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
          <ListItem sx={{ justifyContent: "center", marginBottom: 2 }}>
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
              primary="Tests"
              sx={{ fontWeight: "bolder", color: "#333" }}
            />
          </ListItem>
          <TestsSection
            testDetails={testDetails}
            onOptionClick={onOptionClick}
            handleDrop={handleDrop}
            target="marks"
          />

          {/* Archived Section */}
          <ListItem
            sx={{
              backgroundColor: "#e3f2fd",
              borderRadius: "8px",
              marginBottom: 1,
              display: "flex",
              alignItems: "center",
              padding: 1,
            }}
          >
            <IconButton
              sx={{
                marginRight: 2,
                backgroundColor: "#1976d2",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#115293",
                },
              }}
            >
              <Archive />
            </IconButton>
            <ListItemText
              primary="Archived"
              sx={{
                fontWeight: "bold",
                color: "#333",
              }}
            />
          </ListItem>

          <TestsSection
            testDetails={testDetails}
            onOptionClick={onOptionClick}
            handleDrop={handleDrop}
            target="archived"
          />
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
