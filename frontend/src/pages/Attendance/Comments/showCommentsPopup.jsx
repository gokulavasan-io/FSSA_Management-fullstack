import React, { useEffect, useState, useRef,useContext } from "react";
import axios from "axios";
import API_PATHS from "../../../constants/apiPaths";
import useAttendanceContext from "../AttendanceContext";

// let year = 2024;
// let month = 12;
// let sectionId = 1;

const RemarkPopup = ({ hotTableRef, tableData, remarksData }) => {
  const { sectionId,month,year,remark,setRemark,tooltipPosition,setTooltipPosition,isTooltipVisible,setIsTooltipVisible,tooltipRef} = useAttendanceContext();

  // const [remark, setRemark] = useState(null);
  // const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  // const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  // const tooltipRef = useRef(null);

  async function showRemarks(studentId, date) {
    const student = remarksData.find((item) => item.student_id === studentId);
    const attendanceRecord = student.attendance.find((record) => record.date === date);

    // Set the remark and its position
    if (attendanceRecord?.remark) {
      setRemark(attendanceRecord.remark);
    } else {
      setRemark("No remark available");
    }
  }

  useEffect(() => {
    const hotInstance = hotTableRef.current.hotInstance;

    const handleHover = (event) => {
      const cell = event.target.closest("td");
      if (cell) {
        const row = hotInstance.toVisualRow(cell.parentNode.rowIndex - 1);
        const column = hotInstance.toVisualColumn(cell.cellIndex - 1);
        const classNames = cell.classList.value;

        if (classNames.includes("remarkCell")) {
          let studentId = tableData[row]["student_id"];
          let date = `${year}-${String(month).padStart(2, "0")}-${String(column).padStart(2, "0")}`;
          showRemarks(studentId, date);

          // Calculate position for the tooltip (positioning on the right side of the cell)
          const cellRect = cell.getBoundingClientRect();
          const tooltipWidth = 300; // The width of the tooltip (set to 300px as in the original code)
          const viewportWidth = window.innerWidth;
          const spaceRight = viewportWidth - cellRect.right - 10; // Space available to the right of the cell
          
          // Check if the tooltip overflows on the right side
          if (spaceRight >= tooltipWidth) {
            // Position on the right side of the cell
            setTooltipPosition({
              top: cellRect.top + cellRect.height / 2 - 15, // Vertically align the tooltip with the center of the cell
              left: cellRect.right + 5, // Position to the right of the cell with a small gap
            });
          } else {
            // Position on the left side of the cell if it overflows
            setTooltipPosition({
              top: cellRect.top + cellRect.height / 2 - 15, // Vertically align the tooltip with the center of the cell
              left: cellRect.left - tooltipWidth - 5, // Position to the left of the cell with a small gap
            });
          }

          // Make the tooltip visible
          setIsTooltipVisible(true);
        }
      }
    };

    const handleMouseOut = () => {
      // Only hide the tooltip if the mouse leaves both the cell and the tooltip
      if (!tooltipRef.current || !tooltipRef.current.contains(event.relatedTarget)) {
        setIsTooltipVisible(false); // Hide the tooltip
      }
    };

    const tableElement = hotInstance?.rootElement;
    if (tableElement) {
      tableElement.addEventListener("mousemove", handleHover);
      tableElement.addEventListener("mouseout", handleMouseOut); // Listen for mouse out to hide tooltip
    }

    return () => {
      if (tableElement) {
        tableElement.removeEventListener("mousemove", handleHover);
        tableElement.removeEventListener("mouseout", handleMouseOut); // Clean up the event listener
      }
    };
  }, [hotTableRef, tableData]);

  return (
    <>
      {isTooltipVisible && remark && (
        <div
          ref={tooltipRef} // Add ref to the tooltip div
          style={{
            position: "absolute",
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            background: "#FF69B9", // Pink background (Hot Pink shade)
            color: "#ffffff", // White text color
            padding: "8px 12px",
            borderRadius: "8px", // Rounded corners
            boxShadow: "0 4px 12px rgba(255, 105, 180, 0.3)", // Soft pink shadow
            zIndex: 1000,
            fontSize: "14px", // Slightly larger font size
            fontWeight: "500", // Slightly bolder text
            maxWidth: "300px", // Increased width for longer text
            wordWrap: "break-word", // Wrap long text
            whiteSpace: "normal", // Allow normal word wrapping
            textAlign: "left", // Align text to the left for better readability
            overflow: "hidden", // Hide any overflow text
          }}
        >
          {remark}
        </div>
      )}
    </>
  );
};

export default RemarkPopup;
