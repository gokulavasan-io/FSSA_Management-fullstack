import React, { useRef } from "react";
import ReportCard from "./Components/ReportCard/ReportCard";
import downloadReportCard from "./Components/ReportCard/downloadReportCard";

function MonthlyReportMain() {
  const componentRef = useRef();


  const names = {
    Student: "Gokulavasan",
    Teacher: "Mr. xxx & Mrs. yyy",
  };

  const sec_mon_year = { Section: "A", Month: "Jan", Year: 2025 };

  const marks = {
    English: { studentMark: 80, classAvg: 76 },
    "Life Skills": { studentMark: 89, classAvg: 67 },
    Tech: { studentMark: 56, classAvg: 34 },
    "Problem Solving": { studentMark: 45, classAvg: 76 },
    Overall: { studentMark: 45, classAvg: 23 },
  };

  const absentBehavior = { Absent: 56, Behavior: 34 };
  


  let reportCardProps={names,sec_mon_year,marks,absentBehavior}
  return (
    <>
      <ReportCard ref={componentRef}  {...reportCardProps}   />
      <button
        onClick={() => downloadReportCard(componentRef, "student", "name")}
      >
        Export As PNG
      </button>
    </>
  );
}

export default MonthlyReportMain;
