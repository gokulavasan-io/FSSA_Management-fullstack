import React, { createContext, useState, useContext } from 'react';
import { Snackbar, Alert,Slide } from '../../utils/materialImports';

const SnackbarContext = createContext();

export const useSnackbar = () => {
  return useContext(SnackbarContext);
};

export const SnackbarProvider = ({ children }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info'); // Default severity

  const openSnackbar = (message, severity = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity); // Set the severity (e.g., success, warning, error, info)
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };
  const SlideTransition = (props) => {
    return <Slide {...props} direction="right"  />;
  };

  return (
    <SnackbarContext.Provider value={{ openSnackbar }}>
      {children}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'start' }}
        sx={{
          width: 'fit-content', // Fixed width
          margin: '0', // Ensure no additional margins are added
          left: '20', // Explicitly set the left position
        }}
        TransitionComponent={SlideTransition}
      >
        <Alert onClose={closeSnackbar} severity={snackbarSeverity} sx={{
      width: '100%', 
      padding: '10px', 
      borderRadius: '8px', 
    }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
