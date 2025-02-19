import { useState } from "react";
import { Button, List } from "antd";
import { useMarksContext } from "../../../../Context/MarksContext";

const TestButton = () => {
  const { setOpenNewTestForm } = useMarksContext();
  const [hovered, setHovered] = useState(false);

  return (
    <List.Item>
      <Button
        type="primary"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setOpenNewTestForm(true)}
        style={{
          backgroundColor: hovered ? "#389e0d" : "green",
          borderColor: hovered ? "#237804" : "#52c41a",
          transition: "all 0.3s ease",
        }}
      >
        Add New Test
      </Button>
    </List.Item>
  );
};

export default TestButton;
