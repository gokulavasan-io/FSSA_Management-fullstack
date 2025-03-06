import React, { useEffect } from "react";
import HomeMain from "./HomeMain";
import { useMainContext } from "../../Context/MainContext";


function HomeApp() {

  const {setSelectedSubject}=  useMainContext()
  useEffect(() => {
    setSelectedSubject({ id: null, subject_name: "Dashboard" });
  }, []);

  return (
    <HomeMain />
  );
}

export default HomeApp;
