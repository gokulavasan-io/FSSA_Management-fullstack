import React from 'react';
import { useSnackbar } from 'notistack';
import { IconButton } from '@mui/material'; 
import CloseIcon from '@mui/icons-material/Close'; 

const useNotification = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const showMessage = (message, type) => {
    const variantMap = {
      s: 'success',
      e: 'error',
      w: 'warning',
      i: 'info',
    };

    enqueueSnackbar(message, {
      variant: variantMap[type] || 'info',
      autoHideDuration: 3000,
      action: (
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={() => closeSnackbar()}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      ),
    });
  };

  return showMessage;
};

export default useNotification;
