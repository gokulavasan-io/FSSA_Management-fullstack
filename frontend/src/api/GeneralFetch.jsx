import { useEffect } from "react";
import { useMainContext } from "../Context/MainContext";
import { fetchMonths, fetchSections, fetchSubjects, fetchUserData } from "./generalAPI";

const GeneralFetchComponent = () => {
  const { setMonths, setSubjects,setUserName,setUserRole,setSectionId,setSectionName,setUserId,setSections } = useMainContext();
  let userId=localStorage.getItem("userId")
  useEffect(() => {
    fetchMonths().then((response) => {
      setMonths(response);
    });

    fetchSubjects().then((response) => {
      setSubjects(response);
    });
    fetchSections().then((response)=>{
      setSections(response)
    })

    // fetchUserData(userId).then((response)=>{
    //   setUserId(userId)
    //   setUserName(response.name);
    //   setSectionId(response.section.id);
    //   setSectionName(response.section.name);
    //   setUserRole(response.role.name);

    // })

  }, []);
};

export default GeneralFetchComponent;
