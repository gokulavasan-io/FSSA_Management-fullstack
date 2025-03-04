import { Button } from 'antd'
import React, { useState } from 'react'

function PrimaryBtn({ onClick, label }) {
  const [bgStyle, setBgStyle] = useState("linear-gradient(to bottom, #1E3A5F, #0D233A)");

  return (
    <Button
      type="default"
      style={{
        background: bgStyle,
        border: "1px solid #DADCE0",
        color: "#fff",
        padding: "4px 15px",
        borderRadius: "4px",
        transition: "background 0.3s ease-in-out, transform 0.1s",
      }}
      onClick={onClick}
      onMouseEnter={() => setBgStyle("linear-gradient(to bottom, #2C4F7A, #193A56)")} // Hover effect
      onMouseLeave={() => setBgStyle("linear-gradient(to bottom, #1E3A5F, #0D233A)")} // Default state
      onMouseDown={() => {
        setBgStyle("linear-gradient(to bottom, #152B42, #091829)"); // Clicked (active) state
      }}
      onMouseUp={() => {
        setBgStyle("linear-gradient(to bottom, #2C4F7A, #193A56)"); // Back to hover state
      }}
    >
      {label}
    </Button>
  );
}

export default PrimaryBtn;
