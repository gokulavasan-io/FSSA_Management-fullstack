import React, { useRef } from "react";
import { HotTable } from "@handsontable/react";
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.css";
import "./attendanceMain.css";
import {addRemarkAction} from '../Comments/addRemark'
import RemarkPopup from "../Comments/showCommentsPopup";
import Notification from '../../uxComponents/Notification'; 


const AttendanceTable = ({ tableData, hotColumns, handleAfterChange,remarksData }) => {
  

  const { showMessage } = Notification();
  let month = 12;
  let year = 2024;

  const hotTableRef = useRef(null);

  const handleAddRemark = (row, col) => {
    let studentId = tableData[row].student_id;
    let date = `${year}-${String(month).padStart(2, '0')}-${String(col).padStart(2, '0')}`;
    let studentName=tableData[row].name;
    const student = remarksData.find((item) => item.student_id === studentId);
    let remark=null;
    if (student) {
      const attendanceRecord = student.attendance.find((record) => record.date === date);
      remark=attendanceRecord?.remark
    }
    addRemarkAction(studentId,date,studentName,remark)
    // showMessage("Remark added successfully!", 's');
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
        height="auto"
        licenseKey="non-commercial-and-evaluation"
        fixedColumnsLeft={1}
        afterChange={handleAfterChange}
        contextMenu={{
          items: {
            add_remark: {
              name: "Comment",
              callback: function (_, selection) {
                if (selection && selection.length > 0) {
                  const { row, col } = selection[0].end;
                  handleAddRemark(row, col);
                } else {
                  console.error("No valid selection found.");
                }
              },
            },
            separator: Handsontable.plugins.ContextMenu.SEPARATOR, 
          },
        }}
      />

        {/* add remark dialog box */}

        <div
  id="dialog-container"
  style={{
    display: "none",
  }}
>
  <div
    id="dialog-overlay"
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.5)",
      zIndex: 1000,
      transition: "opacity 0.3s ease",
    }}
  ></div>
  <div
    id="dialog-box"
    style={{
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "#fff",
      padding: "16px",
      borderRadius: "10px",
      boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.2)",
      zIndex: 1001,
      width: "400px",
      maxWidth: "90%",
      transition: "transform 0.3s ease, opacity 0.3s ease",
      opacity: 1,
    }}
  >
    <h3
      style={{
        fontSize: "22px",
        fontWeight: "600",
        color: "#333",
        textAlign: "center",marginTop:'1rem'
      }}
    >
      Add Your Comment
    </h3>
    <p style={{textAlign:"center"}} id="remarkInfo"></p>
    <textarea
  id="remark-input"
  style={{
    width: "100%",
    height: "120px",
    padding: "14px",
    fontSize: "16px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    resize: "none",
    marginBottom: "24px",
    boxSizing: "border-box",
    transition: "border-color 0.3s, box-shadow 0.3s",
    outline:'none'
  }}
  placeholder="Write your comment here..."
  onFocus={(e) => {
    // Change the border color when focused
    e.target.style.border = "1px solid rgba(76, 175, 80, 0.7)";  // Green color for focus
    e.target.style.boxShadow = "0 0 8px rgba(76, 175, 80, 0.3)";  // Soft shadow effect
  }}
  onBlur={(e) => {
    // Reset to original border color when focus is lost
    e.target.style.borderColor = "#ddd";
    e.target.style.boxShadow = "none";
  }}
></textarea>

    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <button
        id="cancel-button"
        style={{
          backgroundColor: "#f5f5f5",
          color: "#333",
          border: "none",
          padding: "12px 24px",
          borderRadius: "8px",
          marginRight: "16px",
          fontWeight: "500",
          cursor: "pointer",
          transition: "background-color 0.3s, transform 0.3s",
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = "#e0e0e0";
          e.target.style.transform = "scale(1.05)";
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = "#f5f5f5";
          e.target.style.transform = "scale(1)";
        }}
      >
        Cancel
      </button>
      <button
        id="submit-button"
        style={{
          backgroundColor: "#4caf50",
          color: "white",
          border: "none",
          padding: "12px 24px",
          borderRadius: "8px",
          fontWeight: "500",
          cursor: "pointer",
          transition: "background-color 0.3s, transform 0.3s",
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = "#45a049";
          e.target.style.transform = "scale(1.05)";
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = "#4caf50";
          e.target.style.transform = "scale(1)";
        }}
      >
        Submit
      </button>
    </div>
  </div>
</div>


        {/* show popup remark */}

        <RemarkPopup hotTableRef={hotTableRef} tableData={tableData} remarksData={remarksData}/>



    </>
  );
};

export default AttendanceTable;
