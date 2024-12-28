import { StrictMode,useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MarkEntry from './src/pages/marksEntry/marksEntry'
import 'handsontable/dist/handsontable.full.css';
import ChatUI from './src/pages/AiChat/chat'

// const [isChat, setIsChat] = useState(true)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MarkEntry  />
    <ChatUI />
  </StrictMode>

)
