import React from "react";
import { MainContextProvider } from "./Context/MainContext";
import Main from "./Main";

function App() {
  return (
    <MainContextProvider>
      <Main />
    </MainContextProvider>
  );
}

export default App;
