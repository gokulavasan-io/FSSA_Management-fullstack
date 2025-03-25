import { useEffect } from "react";
import { useMainContext } from "../../Context/MainContext";
import { fetchMonths, fetchSections, fetchSubjects, fetchUserData } from "../../api/generalAPI";

const GeneralFetchComponent = () => {
  const { setMonths, setSubjects,setUserName,setUserRole,setSectionId,setSectionName,setUserId,setSections,userId } = useMainContext();
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

    fetchUserData(userId).then((response)=>{
      setUserId(userId)
      setUserName(response.name);
      setSectionId(response.section);
      setSectionName(response.section_name);
      setUserRole(response.role_name);

    })

  }, []);
};

export default GeneralFetchComponent;
