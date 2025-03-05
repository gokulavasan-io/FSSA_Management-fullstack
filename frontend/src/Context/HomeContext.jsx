import { createContext, useContext, useState, useRef, useEffect } from "react";
import { useMainContext } from "./MainContext";

// Create the context
const HomeContext = createContext();

// Create a provider component
export const HomeContextProvider = ({ children }) => {
  const { selectedMonth,setSelectedSubject } = useMainContext();
  
  useEffect(() => {
    setSelectedSubject({ id: null, subject_name: "Dashboard" });
  }, []);

  const [monthId, setMonthId] = useState(selectedMonth.id);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setMonthId(selectedMonth.id)
  }, [selectedMonth])
  
  const sectionColors = {
    "A": "#52c41a",  // Green
    "B": "#faad14",  // Yellow
    "C": "#ff4d4f",  // Red
    "D": "#722ed1",  // Purple
    "E": "#13c2c2",  // Cyan
    "F": "#eb2f96",  // Pink
    "All": "#1890ff",      // Blue
  };
  

  return (
    <HomeContext.Provider
      value={{
        monthId,
        setMonthId,
        loading,
        setLoading,
        sectionColors,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};

const useHomeContext = () => {
  return useContext(HomeContext);
};

export default useHomeContext;
