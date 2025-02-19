import React from "react";
import Handsontable from 'handsontable';
import { HotTable } from '@handsontable/react';
import {
  Button,
  Typography,
} from '@mui/material';
import { useMarksContext } from "../../../../Context/MarksContext";

function MainTable(props) {
  const {
    showMainTableColor,
    mainTableData,
    mainTableColumns,
    setShowMainTableColor,
    categoryMark
  } = useMarksContext();

  const cellRendererForMainTable = function (
    instance,
    td,
    row,
    col,
    prop,
    value,
    cellProperties
  ) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    td.classList.remove("cell-red", "cell-yellow", "cell-green");
    if (showMainTableColor) {
      if (col > 0 && value !== "" && !isNaN(value)) {
        const numericValue = Math.round(parseFloat(value));
        if (numericValue <= categoryMark.redEndValue) {
          td.classList.add("cell-red");
        } else if (numericValue <= categoryMark.yellowEndValue) {
          td.classList.add("cell-yellow");
        } else if (numericValue >= categoryMark.greenStartValue) {
          td.classList.add("cell-green");
        }
      }
      if (col > 0 && value === "Absent") td.classList.add("cell-absent");
      if (col === 0) td.classList.add("cell-names");
    } else {
      if (col >= 0) td.classList.add("cell-names");
    }

    if (col > 0) td.classList.add("cell-center");
  };
  const handleColorButtonClick = () => {
    setShowMainTableColor((prev) => !prev);
  };

  return (
    <>
      <Typography
        variant="h5"
        sx={{
          marginBottom: 2,
          height: "3rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        color="primary"
      >
        <div>
          Monthly Average
        </div>
        <Button
          size="small"
          variant="contained"
          onClick={handleColorButtonClick}
          sx={{
            backgroundColor: "#ff4c4c",
            "&:hover": { backgroundColor: "#ff0000" },
          }}
        >
          {showMainTableColor ? "Hide color" : "Show color"}
        </Button>
      </Typography>

      <HotTable
        data={mainTableData}
        colHeaders={mainTableColumns.map((test) => test.title)}
        columns={mainTableColumns}
        width="100%"
        height="650"
        autoRowSize={true}
        licenseKey="non-commercial-and-evaluation"
        rowHeaders={true}
        stretchH="all"
        fixedRowsTop={0}
        fixedColumnsLeft={2}
        columnSorting={true}
        cells={(row, col) => {
          return { renderer: cellRendererForMainTable };
        }}
      />
    </>
  );
}

export default MainTable;
