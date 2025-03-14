import React from "react";
import { MainContextProvider } from "./Context/MainContext";
import GeneralFetchComponent from "./api/GeneralFetch";
import Main from "./Main";


function App() {
  return (
    <MainContextProvider>
      <GeneralFetchComponent />
      <Main />
    </MainContextProvider>
  );
}

export default App;



