import React from 'react';
import { useSnackbar } from 'notistack';
import { IconButton } from '@mui/material'; 
import CloseIcon from '@mui/icons-material/Close'; 

// Notification component
const Notification = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar(); 

  const showMessage = (message, type) => {
    const variantMap = {
      s: 'success', // 's' for success
      e: 'error',   // 'e' for error
      w: 'warning', // 'w' for warning
      i: 'info',    // 'i' for info
    };

    const variant = variantMap[type] || 'info'; 

    const action = (
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={() => closeSnackbar()} 
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    );

    enqueueSnackbar(message, { variant, action,autoHideDuration: 3000 });
  };

  return { showMessage };
};

export default Notification;
