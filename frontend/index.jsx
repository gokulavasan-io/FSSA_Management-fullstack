import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MarkEntry from './src/pages/marksEntry/marksEntry'
import 'handsontable/dist/handsontable.full.css';
import ChatUI from './src/pages/AiChat/chat'
import { SnackbarProvider } from './src/pages/UxComponents/snackbar'; 
import AttendanceTable from './src/pages/attendance/attendance';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SnackbarProvider>
      {/* <MarkEntry />
      <ChatUI /> */}
       <AttendanceTable year={2024} month={12} sectionId={2} />
    </SnackbarProvider>
  </StrictMode>
)
