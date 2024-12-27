import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MarkEntry from './src/pages/marksEntry/marksEntry'
import 'handsontable/dist/handsontable.full.css';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MarkEntry />
  </StrictMode>

)
