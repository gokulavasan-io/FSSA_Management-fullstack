import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
  Typography,
  IconButton,
} from '@mui/material';
import { Add, Menu, Close ,Archive} from '@mui/icons-material';
import API_PATHS from './apiPaths';
import axios from 'axios';
import { format } from 'date-fns';
import { useDrag, useDrop } from 'react-dnd';

const Sidebar = ({ onOptionClick, section, month, subject,totalMarkRef }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar visibility
  const [testDetails, setTestDetails] = useState([]);

  useEffect(() => {
    if (section && month) {
      axios
        .get(`${API_PATHS.GET_ALL_DATA}?section=${section}&month=${month}&subject=${subject}&only_test_detail=true`)
        .then((response) => {
          setTestDetails(response.data || []);
          console.log(response.data);
        })
        .catch((error) => {
          console.error('Error fetching test names:', error);
        });
    }
  }, [section, month]);

  // Toggles sidebar visibility
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Handle dropping a test into the Archived section
  const handleDrop = (item, target) => {
    // If dropped into Archived section, mark as archived
    if (target === 'archived') {
      item.isArchived = true;
    } else {
      item.isArchived = false;
    }

    setTestDetails((prevDetails) =>
      prevDetails.map((test) =>
        test.id === item.id ? { ...test, test_detail: { ...test.test_detail, isArchived: item.isArchived } } : test
      )
    );

    axios.put(`${API_PATHS.UPDATE_ARCHIVE}${item.id}/`, {"isArchived": item.isArchived})
      .then(response => {
        console.log("Marks data updated successfully!", response.data);
      })
      .catch(error => {
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
            position: 'fixed',
            top: 16,
            right: 16, // Ensures button is on the right side
            backgroundColor: '#1976d2',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#115293',
            },
          }}
        >
          <Menu />
        </IconButton>
      )}

      {/* Sidebar Drawer */}
      <Drawer
        sx={{
          '& .MuiDrawer-paper': {
            width: 200,
            boxSizing: 'border-box',
            backgroundColor: '#f9f9f9',
            padding: '16px',
            borderLeft: '1px solid #ddd',
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
              onClick={() => {
                onOptionClick("", null,"", false,false);
              }}
            >
              New
            </Button>
          </ListItem>

          {/* Marks Section */}
          <ListItem sx={{ backgroundColor: '#e3f2fd', borderRadius: '8px', marginBottom: 1 }}>
            <ListItemText primary="Marks" sx={{ fontWeight: 'bold', color: '#333' }} />
          </ListItem>
          <MarksSection
            testDetails={testDetails}
            onOptionClick={onOptionClick}
            handleDrop={handleDrop}
            target="marks"
          />

{/* Archived Section */}
<ListItem 
  sx={{ 
    backgroundColor: '#e3f2fd', 
    borderRadius: '8px', 
    marginBottom: 1, 
    display: 'flex', 
    alignItems: 'center',
    padding: 1
  }}
>
  <IconButton
    sx={{
      marginRight: 2, // Add spacing between the icon and text
      backgroundColor: '#1976d2',
      color: '#fff',
      '&:hover': {
        backgroundColor: '#115293',
      },
    }}
  >
    <Archive />
  </IconButton>
  <ListItemText 
    primary="Archived" 
    sx={{ 
      fontWeight: 'bold', 
      color: '#333' 
    }} 
  />
</ListItem>

<MarksSection
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

// Draggable and Droppable Section Component
const MarksSection = ({ testDetails, onOptionClick, handleDrop, target }) => {
  const [, drop] = useDrop(() => ({
    accept: 'test',
    drop: (item) => handleDrop(item, target),
    canDrop: () => true, // Allow drop even if there are no items
  }));

  return (
    <List ref={drop} component="div" disablePadding>
      {/* Show message when no items available */}
      {testDetails.filter((item) => 
        (target === 'marks' && !item.test_detail.isArchived) || 
        (target === 'archived' && item.test_detail.isArchived)
      ).length === 0 ? (
        <ListItem sx={{ textAlign: 'center', padding: '10px', color: '#000' }}>
          No tests available
        </ListItem>
      ) : (
        testDetails.map((item, index) => {
          if ((target === 'marks' && !item.test_detail.isArchived) || (target === 'archived' && item.test_detail.isArchived)) {
            return (
              <DraggableTestItem
                key={index}
                item={item}
                onOptionClick={onOptionClick}
              />
            );
          }
          return null;
        })
      )}
    </List>
  );
};

// Draggable Item Component
const DraggableTestItem = ({ item, onOptionClick }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'test',
    item: item.test_detail,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <ListItem
      ref={drag}
      button
      onClick={() => {
        onOptionClick(item.test_detail.test_name, item.test_detail.id,item.test_detail.total_marks, item.test_detail.isArchived,true);
      }}
      sx={{
        pl: 4,
        borderRadius: '8px',
        '&:hover': { backgroundColor: '#e3f2fd' },
        marginBottom: 0.5,
        cursor: 'pointer',
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <ListItemText
        primary={
          <>
            <span style={{ fontWeight: 'bold' }}> {item.test_detail.test_name} </span>
            {format(new Date(item.test_detail.created_at), 'dd/MMM/yy')}
          </>
        }
        sx={{ color: '#555', cursor: 'pointer' }}
      />
    </ListItem>
  );
};

export default Sidebar;
