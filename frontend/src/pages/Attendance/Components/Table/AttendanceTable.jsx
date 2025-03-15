import React, { useRef, useEffect } from "react";
import { HotTable } from "@handsontable/react";
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.css";
import RemarkPopup from "../Comments/CommentPopup";
import { useMainContext } from "../../../../Context/MainContext";
import useAttendanceContext from "../../../../Context/AttendanceContext";
import CommentDialog,{addRemarkAction} from "../Comments/AddComment";

const AttendanceTable = ({
  tableData,
  hotColumns,
  handleAfterChange,
  remarksData,
  refetchAttendance,
}) => {
  const { year } = useMainContext();
  const { monthId } = useAttendanceContext();

  const hotTableRef = useRef(null);

  const handleAddRemark = (row, col) => {
    let studentId = tableData[row].student_id;
    let date = `${year}-${String(monthId).padStart(2, "0")}-${String(
      col
    ).padStart(2, "0")}`;
    let studentName = tableData[row].name;
    const student = remarksData.find((item) => item.student_id === studentId);
    let remark = null;
    if (student) {
      const attendanceRecord = student.attendance.find(
        (record) => record.date === date
      );
      remark = attendanceRecord?.remark;
    }
    addRemarkAction(studentId, date, studentName, remark, refetchAttendance);
  };

  return (
    <>
      <HotTable
        ref={hotTableRef}
        data={tableData}
        colHeaders={hotColumns.map((col) => col.title)}
        columns={hotColumns}
        rowHeaders
        width="100%"
        height="700"
        licenseKey="non-commercial-and-evaluation"
        fixedColumnsLeft={1}
        fixedRowsTop={0}
        afterChange={handleAfterChange}
        contextMenu={{
          items: {
            add_remark: {
              name: "Comment",
              callback: (_, selection) => {
                if (selection && selection.length > 0) {
                  const { row, col } = selection[0].end;
                  handleAddRemark(row, col);
                }
              },
            },
            separator: Handsontable.plugins.ContextMenu.SEPARATOR,
          },
        }}
      />

      {/* add Comment dialog box */}
      <CommentDialog />

      {/* Show popup remarks */}
      <RemarkPopup
        hotTableRef={hotTableRef}
        tableData={tableData}
        remarksData={remarksData}
      />
    </>
  );
};

export default AttendanceTable;
