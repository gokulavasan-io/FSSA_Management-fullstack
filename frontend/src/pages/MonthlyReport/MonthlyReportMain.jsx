import React, { useRef, useState, useEffect } from "react";
import StudentsMarksTable from "./Components/Table/MarksTable";
import { useMainContext } from "../../Context/MainContext";
import SubjectMultiSelect from "./Components/SubjectDropdown";
import { fetchMonthlyReport } from "../../api/monthlyReportAPI";
import { FwButton } from "@freshworks/crayons/react";
import ReportCardPage from "./Components/ReportCard/ReportCardPage";

function MonthlyReportMain() {
  const componentRef = useRef();
  const { subjects, attendanceBehaviorIds } = useMainContext();
  const [data, setData] = useState({});
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [studentsData, setStudentsData] = useState({});
  const [classData, setClassData] = useState({});
  const [studentData, setStudentData] = useState({});
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [studentNames, setStudentNames] = useState([]);
  const [downloadReportCardPage, setDownloadReportCardPage] = useState(false);

  // Initialize selected subjects (include Attendance & Behavior always)
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

  // Fetch data based on selected subjects
  useEffect(() => {
    if (selectedSubjects.length > 0) {
      async function fetchData() {
        let response = await fetchMonthlyReport(null, 1, selectedSubjects);
        setData(response);
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
      }
      fetchData();
    }
  }, [selectedSubjects]);

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
        Month: "Feb",
        Year: 2025,
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
    setDownloadReportCardPage,handleSearchStudent,subjects,selectedSubjects,setSelectedSubjects,attendanceBehaviorIds
  };
  return (
    <>
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

export default MonthlyReportMain;
