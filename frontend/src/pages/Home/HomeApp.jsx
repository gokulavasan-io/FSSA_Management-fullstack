import React from "react";
import HomeMain from "./HomeMain";
import { HomeContextProvider } from "../../Context/HomeContext";

function HomeApp() {
  return (
    <HomeContextProvider>
      <HomeMain />
    </HomeContextProvider>
  );
}

export default HomeApp;
