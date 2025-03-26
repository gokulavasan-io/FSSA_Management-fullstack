import { useEffect } from "react";
import { useMainContext } from "../../Context/MainContext";
import {
  fetchMonths,
  fetchSections,
  fetchSubjects,
  fetchUserData,
} from "../../api/generalAPI";

const GeneralFetchComponent = () => {
  const {
    setMonths,
    setSubjects,
    setUserName,
    setUserRole,
    setSectionId,
    setSectionName,
    setUserId,
    setSections,
    userId,
    setUserImageUrl,
    setSelectedKey,
    setSelectedMonth,
    setSelectedSubject,
    setCategoryName,
  } = useMainContext();

  useEffect(() => {
    fetchMonths().then((response) => {
      setMonths(response);
    });

    fetchSubjects().then((response) => {
      setSubjects(response);
    });
    fetchSections().then((response) => {
      setSections(response);
    });

    fetchUserData(userId).then((response) => {
      setUserImageUrl(
        response.image ||
          "https://cdn-icons-png.flaticon.com/256/149/149071.png"
      );
      setUserId(userId);
      setUserName(response?.name.split(" ")[0]);
      setSectionId(response.section);
      setSectionName(response.section_name);
      setUserRole(response.role_name);
    });

    const storedKey = sessionStorage.getItem("selectedKey");
    const storedCategory = sessionStorage.getItem("categoryName");
    const storedSubject = sessionStorage.getItem("selectedSubject");
    const storedMonth = sessionStorage.getItem("selectedMonth");

    if (storedMonth) setSelectedMonth(JSON.parse(storedMonth));
    if (storedSubject) setSelectedSubject(JSON.parse(storedSubject));
    if (storedKey) setSelectedKey(storedKey);
    if (storedCategory) setCategoryName(storedCategory);

    const date = new Date();
    const monthNumber = date.getMonth() + 1;
    const monthName = date.toLocaleString("default", { month: "long" });

    if (!storedSubject) setSelectedSubject({ subject_name: "Dashboard" });
    if (!storedMonth)
      setSelectedMonth({ id: monthNumber, month_name: monthName });
  }, []);


};

export default GeneralFetchComponent;
