import React, { useState } from "react";
import { Popover, Typography } from "antd";

const { Title } = Typography;

const StudentPopOver = ({ popoverVisible,setPopoverVisible,popoverContent,popoverPosition }) => {

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
