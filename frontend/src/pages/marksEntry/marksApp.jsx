import { MarksContextProvider } from "../../Context/MarksContext.jsx";
import MarksMain from "./MarksMain.jsx";
import React from 'react'

function MarkApp() {
  return (
    <MarksContextProvider>
        <MarksMain />
    </MarksContextProvider>
  )
}

export default MarkApp