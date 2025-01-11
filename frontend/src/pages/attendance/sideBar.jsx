import React, { useState } from "react";
import { Drawer, IconButton } from "@mui/material";
import { Menu, Close } from "@mui/icons-material";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar visibility

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
            right: 16, 
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
          <Close />
        </IconButton>
      </Drawer>
    </>
  );
};

export default Sidebar;
