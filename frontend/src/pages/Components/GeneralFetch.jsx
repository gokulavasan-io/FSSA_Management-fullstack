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
    setUserImageUrl,
    setSelectedKey,
    setSelectedMonth,
    setSelectedSubject,
    setCategoryName,
  } = useMainContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [months, subjects, sections, userData] = await Promise.all([
          fetchMonths(),
          fetchSubjects(),
          fetchSections(),
          fetchUserData(),
        ]);
        

        // Set fetched data
        setMonths(months);
        setSubjects(subjects);
        setSections(sections);

        // Set user details
        setUserImageUrl(
          userData.image_link ||
            "https://cdn-icons-png.flaticon.com/256/149/149071.png"
        );
        setUserId(userData?.id);
        setUserName(userData?.name.split(" ")[0]);
        setSectionId(userData.section);
        setSectionName(userData.section_name);
        setUserRole(userData.role_name);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // Retrieve stored session values
    const storedKey = sessionStorage.getItem("selectedKey");
    const storedCategory = sessionStorage.getItem("categoryName");
    const storedSubject = sessionStorage.getItem("selectedSubject");
    const storedMonth = sessionStorage.getItem("selectedMonth");

    if (storedMonth) setSelectedMonth(JSON.parse(storedMonth));
    if (storedSubject) setSelectedSubject(JSON.parse(storedSubject));
    if (storedKey) setSelectedKey(storedKey);
    if (storedCategory) setCategoryName(storedCategory);

    // Set default subject & month if not in storage
    const date = new Date();
    const monthNumber = date.getMonth() + 1;
    const monthName = date.toLocaleString("default", { month: "long" });

    if (!storedSubject) setSelectedSubject({ subject_name: "Dashboard" });
    if (!storedMonth)
      setSelectedMonth({ id: monthNumber, month_name: monthName });
  }, []);

};

export default GeneralFetchComponent;
