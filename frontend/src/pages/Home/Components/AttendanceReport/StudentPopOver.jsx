import React, { useState } from "react";
import { Popover, Typography } from "antd";

const { Title } = Typography;

const StudentPopOver = ({ studentData,popoverVisible,setPopoverVisible,popoverContent,setPopoverContent,popoverPosition,setPopoverPosition }) => {

  const handleChartClick = (category, event) => {
    const students = studentData[category] || [];
    setPopoverContent(
      <div>
        <Title level={5} style={{ color: "#8e44ad" }}>{category} Students</Title>
        <div style={{ display: "flex", flexWrap: "wrap", maxWidth: "500px", gap: "5px" }}>
          {students.length > 0
            ? students.map((student, index) => (
                <span key={index} style={{ display: "inline-block", color: "#71797E" }}>
                  {`${student}, `}
                </span>
              ))
            : "No students"}
        </div>
      </div>
    );
    setPopoverPosition({ x: event.pageX, y: event.pageY - 100 });
    setPopoverVisible(true);
  };

  return (
    <Popover
      content={popoverContent}
      open={popoverVisible}
      trigger="click"
      placement="rightTop"
      onOpenChange={(visible) => !visible && setPopoverVisible(false)}
      arrow={true}
    >
      <div style={{ position: "absolute", left: popoverPosition.x, top: popoverPosition.y }} />
    </Popover>
  );
};

export default StudentPopOver;
