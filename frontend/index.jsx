import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MarkEntry from './src/pages/marksEntry/marksEntry'
import 'handsontable/dist/handsontable.full.css';
import ChatUI from './src/pages/AiChat/chat'
import { SnackbarProvider } from './src/pages/UxComponents/snackbar'; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SnackbarProvider>
      <MarkEntry />
      <ChatUI />
    </SnackbarProvider>
  </StrictMode>
)
