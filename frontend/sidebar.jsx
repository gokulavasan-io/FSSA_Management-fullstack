import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
  Collapse,
  ListItemIcon,
  Typography,
  IconButton,
} from '@mui/material';
import { ExpandLess, ExpandMore, Add, Menu, Close } from '@mui/icons-material';

const navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar visibility
  const [marksOpen, setMarksOpen] = useState(false); // Collapse state for Marks
  const [archivedOpen, setArchivedOpen] = useState(false); // Collapse state for Archived

  // Toggles sidebar visibility
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Toggles the collapse/expand for sections
  const toggleMarks = () => setMarksOpen((prev) => !prev);
  const toggleArchived = () => setArchivedOpen((prev) => !prev);

  return (
    <>
      {/* Floating Button to Open Sidebar */}
      {!sidebarOpen && (
        <IconButton
          onClick={toggleSidebar}
          sx={{
            position: 'fixed',
            top: 16,
            left: 16, // Ensure button stays on the right side
            backgroundColor: '#1976d2',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#115293',
            },
          }}
        >
          <Menu /> {/* Menu icon */}
        </IconButton>
      )}

      {/* Sidebar Drawer */}
      <Drawer
        sx={{
          '& .MuiDrawer-paper': {
            width: 300,
            boxSizing: 'border-box',
            backgroundColor: '#f9f9f9',
            padding: '16px',
            borderLeft: '1px solid #ddd', // Add border to separate visually
            position: 'relative',
          },
        }}
        anchor="left" // Ensures sidebar opens on the right side
        open={sidebarOpen} // Sidebar visibility controlled by state
        onClose={toggleSidebar} // Closes when toggled
      >
        {/* Close Button Inside Sidebar */}
        <IconButton
          onClick={toggleSidebar}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8, // Close button in the top-right corner inside sidebar
            backgroundColor: '#1976d2',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#115293',
            },
          }}
        >
          <Close />
        </IconButton>

        <Typography
          variant="h6"
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            marginTop: 4,
            marginBottom: 2,
            color: '#555',
          }}
        >
          Sidebar
        </Typography>
        <List>
          {/* New Button */}
          <ListItem sx={{ justifyContent: 'center', marginBottom: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                padding: '10px 20px',
                borderRadius: '8px',
              }}
            >
              New
            </Button>
          </ListItem>

          {/* Marks Section */}
          <ListItem
            button
            onClick={toggleMarks}
            sx={{
              backgroundColor: marksOpen ? '#e3f2fd' : 'transparent',
              borderRadius: '8px',
              '&:hover': { backgroundColor: '#f5f5f5' },
              marginBottom: 1,
            }}
          >
            <ListItemText primary="Marks" sx={{ fontWeight: 'bold', color: '#333' }} />
            <ListItemIcon>{marksOpen ? <ExpandLess /> : <ExpandMore />}</ListItemIcon>
          </ListItem>
          <Collapse in={marksOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {['Marks List 1', 'Marks List 2', 'Marks List 3'].map((item, index) => (
                <ListItem
                  button
                  key={index}
                  sx={{
                    pl: 4,
                    borderRadius: '8px',
                    '&:hover': { backgroundColor: '#e3f2fd' },
                    marginBottom: 0.5,
                  }}
                >
                  <ListItemText primary={item} sx={{ color: '#555' }} />
                </ListItem>
              ))}
            </List>
          </Collapse>

          {/* Archived Section */}
          <ListItem
            button
            onClick={toggleArchived}
            sx={{
              backgroundColor: archivedOpen ? '#e3f2fd' : 'transparent',
              borderRadius: '8px',
              '&:hover': { backgroundColor: '#f5f5f5' },
              marginBottom: 1,
            }}
          >
            <ListItemText primary="Archived" sx={{ fontWeight: 'bold', color: '#333' }} />
            <ListItemIcon>{archivedOpen ? <ExpandLess /> : <ExpandMore />}</ListItemIcon>
          </ListItem>
          <Collapse in={archivedOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {['Archived List 1', 'Archived List 2', 'Archived List 3'].map((item, index) => (
                <ListItem
                  button
                  key={index}
                  sx={{
                    pl: 4,
                    borderRadius: '8px',
                    '&:hover': { backgroundColor: '#e3f2fd' },
                    marginBottom: 0.5,
                  }}
                >
                  <ListItemText primary={item} sx={{ color: '#555' }} />
                </ListItem>
              ))}
            </List>
          </Collapse>
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
