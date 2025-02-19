import App from "./App";
import React from "react";
import { MainContextProvider } from "./Context/MainContext";
import GeneralFetchComponent from "./GeneralFetch";

function Main() {
  return (
    <MainContextProvider>
      <GeneralFetchComponent />
      <App />
    </MainContextProvider>
  );
}

export default Main;
