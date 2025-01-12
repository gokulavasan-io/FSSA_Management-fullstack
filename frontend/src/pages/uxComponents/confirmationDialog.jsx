import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from "@mui/material";

const ConfirmationDialog = ({ open, onClose, title, content, onConfirm, confirmText = "Confirm", cancelText = "Cancel" }) => {
  return (
    <Dialog
      open={open}
      onClose={() => onClose(false)}
      PaperProps={{
        sx: {
          borderRadius: 4,
          padding: 2,
          width: "400px",
          maxWidth: "90%",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          textAlign: "center",
          color: "primary.main",
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent
        sx={{
          textAlign: "center",
          padding: "16px 8px",
        }}
      >
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          {content}
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "space-around",
          paddingX: 2,
        }}
      >
        <Button
          onClick={() => onClose(false)}
          color="secondary"
          variant="outlined"
          sx={{
            borderRadius: 2,
            paddingX: 3,
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={() => onClose(true)}
          color="primary"
          variant="contained"
          sx={{
            borderRadius: 2,
            paddingX: 3,
            boxShadow: 3,
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
