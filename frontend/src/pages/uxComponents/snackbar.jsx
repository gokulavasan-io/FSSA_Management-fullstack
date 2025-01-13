import React, { createContext, useState, useContext } from 'react';
import { Snackbar, Alert, Slide } from '../../utils/materialImports';

const SnackbarContext = createContext();

export const useSnackbar = () => {
  return useContext(SnackbarContext);
};

export const SnackbarProvider = ({ children }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info'); 


  const successSound = new Audio('/assets/audio/success_alert_sound.wav');
  successSound.preload = 'auto';
  // const errorSound = new Audio('/assets/audio/error_alert_sound.mp3');
  // errorSound.preload = 'auto';

const openSnackbar = (message, severity = 'info') => {
  setSnackbarMessage(message);
  setSnackbarSeverity(severity);
  setSnackbarOpen(true);

  if (severity === 'error') {
    errorSound.play().catch((err) => {
      console.error('Error playing alert sound:', err);
    });
  }
  // if (severity === 'success'){
  //   successSound.play().catch((err) => {
  //     console.error('Error playing alert sound:', err);
  //   });
  // }
};


  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  const SlideTransition = (props) => {
    return <Slide {...props} direction="right" />;
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
          width: 'fit-content', 
          margin: '0', 
          left: '20', 
        }}
        TransitionComponent={SlideTransition}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbarSeverity}
          sx={{
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
