import React, { useRef } from "react";
import ReportCard from "./Components/ReportCard/ReportCard";
import downloadReportCard from "./Components/ReportCard/downloadReportCard";

function MonthlyReportMain() {
  const componentRef = useRef();

  return (
    <>
      <ReportCard ref={componentRef} />
      {/* <button
        onClick={() => downloadReportCard(componentRef, "student", "name")}
      >
        Export As PNG
      </button> */}
    </>
  );
}

export default MonthlyReportMain;
