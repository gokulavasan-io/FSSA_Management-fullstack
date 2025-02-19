import { useEffect } from "react";
import { useMainContext } from "./Context/MainContext";
import { fetchMonths, fetchSubjects } from "./api/generalAPI";

const GeneralFetchComponent = () => {
  const { setMonths, setSubjects } = useMainContext();
  useEffect(() => {
    fetchMonths().then((response) => {
      setMonths(response);
    });

    fetchSubjects().then((response) => {
      setSubjects(response);
    });
  }, []);
};

export default GeneralFetchComponent;
