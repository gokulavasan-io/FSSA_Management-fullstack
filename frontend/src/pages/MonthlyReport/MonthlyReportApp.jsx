import React, { useRef, useState, useEffect } from "react";
import StudentsMarksTable from "./Components/Table/MarksTable";
import { useMainContext } from "../../Context/MainContext";
import SubjectMultiSelect from "./Components/Dropdown/SubjectDropdown";
import { fetchMonthlyReport } from "../../api/monthlyReportAPI";
import { FwButton } from "@freshworks/crayons/react";
import ReportCardPage from "./Components/ReportCard/ReportCardPage";
import Loader from '../Components/Loader'

function MonthlyReportApp() {
  const componentRef = useRef();
  const { subjects, attendanceBehaviorIds,sectionId,selectedMonth,year } = useMainContext();
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [studentsData, setStudentsData] = useState({});
  const [classData, setClassData] = useState({});
  const [studentData, setStudentData] = useState({});
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [studentNames, setStudentNames] = useState([]);
  const [downloadReportCardPage, setDownloadReportCardPage] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let initialSubjects = new Set([
      "English",
      "Tech",
      "Life Skills",
      "Problem Solving",
      "Attendance",
      "Behavior",
    ]);

    const allFilteredSubjects = subjects.filter((subject) =>
      initialSubjects.has(subject.subject_name)
    );
    const ids = allFilteredSubjects.map((subject) => subject.id);

    setSelectedSubjects(ids);
  }, [subjects]);

  useEffect(() => {
    if (selectedSubjects.length > 0) {
      async function fetchData() {
        try {
          let response = await fetchMonthlyReport(sectionId, selectedMonth.id, selectedSubjects);
        setStudentsData(response?.students);
        setClassData(response?.class_average);

        const names = Object.keys(response?.students);
        setStudentNames(names);

        if (names.length > 0) {
          setStudentData(
            formatStudentsData(
              response?.students[names[0]],
              response?.class_average,
              names[0]
            )
          );
          setCurrentStudentIndex(0);
        }
          
        } catch (error) {
            console.error("Error fetching monthly data : ",error);
            
        }
        finally{
          setLoading(false)
        }
      }
      fetchData();
    }
  }, [selectedSubjects,selectedMonth,year]);

  const handleNextStudent = () => {
    if (currentStudentIndex < studentNames.length - 1) {
      const nextIndex = currentStudentIndex + 1;
      setCurrentStudentIndex(nextIndex);
      const studentName = studentNames[nextIndex];
      setStudentData(
        formatStudentsData(studentsData[studentName], classData, studentName)
      );
    }
  };

  const handlePrevStudent = () => {
    if (currentStudentIndex > 0) {
      const prevIndex = currentStudentIndex - 1;
      setCurrentStudentIndex(prevIndex);
      const studentName = studentNames[prevIndex];
      setStudentData(
        formatStudentsData(studentsData[studentName], classData, studentName)
      );
    }
  };

  function formatStudentsData(data, classData, studentName) {
    if (!data || !classData) return {};

    let marks = {};
    let otherSubjects = ["Attendance", "Behavior", "Academic Average"];

    Object.keys(data.scores).forEach((subject) => {
      if (!otherSubjects.includes(subject)) {
        marks[subject] = {
          studentMark: data.scores[subject],
          classAvg: classData[data.section]?.[subject] || 0,
        };
      }
    });

    return {
      names: {
        Student: studentName,
        Teacher: "Mr. xxx & Mrs. yyy",
      },
      sec_mon_year: {
        Section: data.section,
        Month: selectedMonth?.month_name.slice(0,3),
        Year: year,
      },
      marks: marks,
      attendanceBehavior: {
        Attendance: data.scores["Attendance"],
        Behavior: data.scores["Behavior"],
      },
    };
  }

  const handleSearchStudent = (studentName) => {
    const index = studentNames.indexOf(studentName);
    if (index !== -1) {
      setCurrentStudentIndex(index);
      setStudentData(
        formatStudentsData(studentsData[studentName], classData, studentName)
      );
    }
  };
  

  let reportCardProps = {
    handleNextStudent,
    handlePrevStudent,
    studentData,
    currentStudentIndex,
    componentRef,
    studentNames,
    setDownloadReportCardPage,handleSearchStudent,selectedSubjects,setSelectedSubjects,formatStudentsData,
    studentsData,setStudentData,classData
  };
  return (

    loading? <Loader /> :<>
    {!downloadReportCardPage && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <SubjectMultiSelect
             width={600}
              subjects={subjects}
              selectedSubjects={selectedSubjects}
              setSelectedSubjects={(value) => {
                const finalSubjects = [
                  ...new Set([...value, ...attendanceBehaviorIds]),
                ];
                setSelectedSubjects(finalSubjects);
              }}
            />
            <FwButton
              color="primary"
              onFwClick={() => setDownloadReportCardPage(true)}
            >
              Download Report Card
            </FwButton>
          </div>
          <StudentsMarksTable studentsData={studentsData} />
        </>
      )}
      {downloadReportCardPage && <ReportCardPage {...reportCardProps} />}
    </>

      

  );
}

export default MonthlyReportApp;
