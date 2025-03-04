import React, { useState } from "react";
import { Button } from "antd";

function SecondaryBtn({ onClick, label }) {
  const [bgStyle, setBgStyle] = useState("linear-gradient(to bottom, #FFFFFF, #F2F4F8)");

  return (
    <Button
      type="default"
      style={{
        background: bgStyle,
        border: "1px solid #DADCE0",
        color: "#000",
        padding: "4px 15px",
        borderRadius: "4px",
        transition: "background 0.3s ease-in-out, transform 0.1s",
      }}
      onClick={onClick}
      onMouseEnter={() => setBgStyle("linear-gradient(to bottom, #E6E8EB, #DDE1E6)")} // Hover effect
      onMouseLeave={() => setBgStyle("linear-gradient(to bottom, #FFFFFF, #F2F4F8)")} // Default state
      onMouseDown={() => {
        setBgStyle("linear-gradient(to bottom, #D0D3D9, #C1C7D0)"); // Active state
      }}
      onMouseUp={() => {
        setBgStyle("linear-gradient(to bottom, #E6E8EB, #DDE1E6)"); // Return to hover state
      }}
    >
      {label}
    </Button>
  );
}

export default SecondaryBtn;
