import { MarksContextProvider } from "./contextFile.jsx";
import MarkEntry from "./marksEntry.jsx";

import React from 'react'

function MarkApp() {
  return (
    <MarksContextProvider>
        <MarkEntry />
    </MarksContextProvider>
  )
}

export default MarkApp