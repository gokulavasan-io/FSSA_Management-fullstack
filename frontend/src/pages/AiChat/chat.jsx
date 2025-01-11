import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import API_PATHS from "../../constants/apiPaths";
import {
  IconButton,
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Badge,
  styled,Dialog,DialogTitle,DialogContent,DialogActions
} from "../../utils/materialImports";
import { BsChatDots } from "react-icons/bs";
import { dayjs, utc, timezone } from "../../utils/dateImports";
import { useSnackbar } from "../UxComponents/snackbar";

dayjs.extend(utc);
dayjs.extend(timezone);

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: 320,
    padding: "16px",
  },
}));

const FloatingButton = styled(IconButton)(({ theme }) => ({
  position: "fixed",
  bottom: 24,
  right: 24,
  backgroundColor: "#1976d2",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#1565c0",
  },
}));

const ChatContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
}));

const MessageList = styled(List)(({ theme }) => ({
  flexGrow: 1,
  overflow: "auto",
  marginBottom: "16px",
}));

const InputContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: "8px",
  padding: "16px 0",
  marginBottom: "16px",
}));

const MessageBubble = styled(Box)(({ theme, isResponse }) => ({
  backgroundColor: isResponse ? "#f5f5f5" : "#1976d2",
  color: isResponse ? "#000" : "white",
  padding: "12px 16px",
  borderRadius: "16px",
  maxWidth: "80%",
  marginLeft: isResponse ? "0" : "auto",
  marginRight: isResponse ? "auto" : "0",
  marginBottom: "2px",
  boxShadow: isResponse ? "none" : "0px 4px 6px rgba(0, 0, 0, 0.1)",
  cursor: "pointer",
}));

const MessageTime = styled(Typography)(({ theme, isResponse }) => ({
  fontSize: "0.75rem",
  color: "#aaa",
  textAlign: isResponse ? "left" : "right",
  marginTop: "4px",
}));

const PromptResponseContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  marginBottom: "2px",
}));

const PromptContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: "2px",
  justifyContent: "flex-end",
}));

const ResponseContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: "2px",
  justifyContent: "flex-start",
}));

const SenderName = styled(Typography)(({ theme, isResponse }) => ({
  fontSize: "0.85rem",
  fontWeight: "bold",
  marginBottom: "4px",
  marginLeft: isResponse ? '0rem' : '10rem',
  color: "#000",
  cursor:"pointer"
}));

const ChatUI = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatData, setChatData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const messageEndRef = useRef(null);
  const { openSnackbar } = useSnackbar(); 

  useEffect(() => {
    axios
      .get(API_PATHS.GET_CHAT_DATA)
      .then((response) => {
        setChatData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching chat data:", error.message);
        openSnackbar("Something went wrong. Try again later.",'error');

      });
  }, [open]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [chatData]);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleSend = () => {
    if (message.trim()) {
      axios
        .post(API_PATHS.CHAT_WITH_AI, { prompt: message })
        .then((response) => {
          setChatData([...chatData, { 
            id: response.data.id, 
            prompt: message, 
            response: response.data.response, 
            time: response.data.time 
          }]);
        })
        .catch((error) => {
          console.error("Error submitting message:", error.message);
          openSnackbar("Something went wrong. Try again later.",'error');
        });
      setMessage("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleOpenDeleteDialog = (id) => {
    setSelectedMessageId(id);
    setOpenDialog(true);
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
    setSelectedMessageId(null);
  };

  const handleDeleteMessage = () => {
    if (!selectedMessageId) return;

    axios
      .delete(`${API_PATHS.DELETE_CHAT}${selectedMessageId}/`)
      .then(() => {
        setChatData(chatData.filter((msg) => msg.id !== selectedMessageId));
        setOpenDialog(false);
        setSelectedMessageId(null);
        openSnackbar("Message deleted successfully.",'success');
      })
      .catch((error) => {
        console.error("Error deleting message:", error.message);
        openSnackbar("Failed to delete the message. Try again later.",'error');
      });
  };

  const convertISOtoIST = (timestamp) => {
    return dayjs(timestamp).tz("Asia/Kolkata").format("DD/MM/YY HH:mm A");
  };

  return (
    <>
      <FloatingButton onClick={handleToggle} aria-label="Open chat" size="large">
        <Badge badgeContent={chatData.length} color="error">
          <BsChatDots size={24} />
        </Badge>
      </FloatingButton>

      <StyledDrawer
        anchor="right"
        open={open}
        onClose={handleToggle}
        role="dialog"
        aria-label="Chat panel"
      >
        <ChatContainer>
          <Typography variant="h6" component="div" gutterBottom>
            Chat with AI
          </Typography>

          <MessageList>
            {chatData.map((msg, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={
                    <PromptResponseContainer>
                      <PromptContainer>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <SenderName
                            isResponse={false}
                            onClick={() => handleOpenDeleteDialog(msg.id)}
                          >
                            You
                          </SenderName>
                          <MessageBubble isResponse={false}>
                            <Typography component="span" variant="body2">
                              {msg.prompt}
                            </Typography>
                          </MessageBubble>
                          <MessageTime isResponse={false}>
                            {convertISOtoIST(msg.time)}
                          </MessageTime>
                        </Box>
                      </PromptContainer>

                      <ResponseContainer>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <SenderName isResponse={true}>AI</SenderName>
                          <MessageBubble isResponse={true}>
                            <Typography component="span" variant="body2">
                              {msg.response}
                            </Typography>
                          </MessageBubble>
                          <MessageTime isResponse={true}>
                            {convertISOtoIST(msg.time)}
                          </MessageTime>
                        </Box>
                      </ResponseContainer>
                    </PromptResponseContainer>
                  }
                />
              </ListItem>
            ))}
            <div ref={messageEndRef} />
          </MessageList>

          <InputContainer>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type here ..."
              variant="outlined"
              size="small"
            />
            <Button variant="contained" onClick={handleSend} disabled={!message.trim()}>
              Send
            </Button>
          </InputContainer>
        </ChatContainer>
      </StyledDrawer>

      <Dialog
        open={openDialog}
        onClose={handleCancelDelete}
        aria-labelledby="delete-confirmation-dialog"
      >
        <DialogTitle id="delete-confirmation-dialog">Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this message?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteMessage} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChatUI;
