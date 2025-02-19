import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Info } from "@mui/icons-material";
import { useMarksContext } from "../../../../Context/MarksContext";

function InfoButton() {
  const { setTestDetailCardVisible } = useMarksContext();

  const handleClick = () => {
    setTestDetailCardVisible(true);
  };

  return (
    <Tooltip title="More Info">
      <IconButton onClick={handleClick} color="primary">
        <Info />
      </IconButton>
    </Tooltip>
  );
}

export default InfoButton;
