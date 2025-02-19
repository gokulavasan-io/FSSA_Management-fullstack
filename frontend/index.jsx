import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './src/App';
import Main from './src/Main';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Main />
  </StrictMode>
)
