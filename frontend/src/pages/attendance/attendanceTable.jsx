import React from "react";
import { HotTable } from "@handsontable/react";
import "./attendanceMain.css"

const AttendanceTable = ({ tableData, hotColumns, handleAfterChange }) => {
  return (
    <HotTable
      data={tableData}
      colHeaders={hotColumns.map((col) => col.title)}
      columns={hotColumns}
      rowHeaders
      width="100%"
      height="auto"
      licenseKey="non-commercial-and-evaluation"
      fixedColumnsLeft={1}
      afterChange={handleAfterChange}
    />
  );
};

export default AttendanceTable;
