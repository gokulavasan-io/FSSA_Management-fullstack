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
  
  

  return (
    <HomeContext.Provider
      value={{
        monthId,
        setMonthId,
        loading,
        setLoading,
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
