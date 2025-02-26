import React from "react";
import { MainContextProvider } from "./Context/MainContext";
import GeneralFetchComponent from "./GeneralFetch";
import Main from "./Main";
import { AttendanceContextProvider } from "./Context/AttendanceContext";


function App() {
  return (
    <MainContextProvider>
      <GeneralFetchComponent />
      <Main />
    </MainContextProvider>
  );
}

export default App;
