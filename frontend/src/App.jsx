import React from "react";
import { MainContextProvider } from "./Context/MainContext";
import Main from "./Main";
import GeneralFetchComponent from "./pages/Components/GeneralFetch";

function App() {
  return (
    <MainContextProvider>
      <GeneralFetchComponent />
      <Main />
    </MainContextProvider>
  );
}

export default App;
