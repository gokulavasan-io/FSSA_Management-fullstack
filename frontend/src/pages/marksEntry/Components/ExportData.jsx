import React, { useState } from "react";
import { jsPDF } from "jspdf";
import { Button, Dropdown, Menu } from "antd";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useMarksContext } from "../../../Context/MarksContext";
import { DownOutlined } from "@ant-design/icons";
import { FwButton } from "@freshworks/crayons/react";

const ExportData = () => {
  const {
    testTableData,
    mainTableData,
    mainTableColumns,
    totalMark,
    isMainTable,
    testName,
    subjectId,
    monthId,
    section,
  } = useMarksContext();

  let data;
  let columns;
  let docName;

  if (isMainTable) {
    data = mainTableData;
    columns = mainTableColumns;
    docName = `${monthId} - ${subjectId} - ${section}`;
  } else {
    data = Object.values(testTableData).map((student) => [
      student.student_name,
      student.mark,
      student.average_mark,
      student.remark,
    ]);
    columns = ["Student Name", `Mark ${totalMark}`, "Average Mark", "Remark"];
    docName = `${testName} -${monthId} - ${subjectId} - ${section}`;
  }

  const exportToCSV = () => {
    const csv = data.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    saveAs(blob, `${docName}.csv`);
  };

  const exportToJSON = () => {
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: "application/json" });
    saveAs(blob, `${docName}.json`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageMargin = 20;
    const availableWidth = pageWidth - pageMargin * 2;
    const rowHeight = 10;
    const bodyFontSize = 8;
    let currentY = pageMargin;

    doc.setFontSize(16);
    doc.text(docName, pageWidth / 2, currentY, { align: "center" });
    currentY += rowHeight + 5;

    doc.setFontSize(bodyFontSize);

    data.forEach((row) => {
      let currentX = pageMargin;
      row.forEach((cell) => {
        const cellText = cell != null ? cell.toString() : "";
        doc.text(cellText, currentX, currentY);
        currentX += 40;
      });
      currentY += rowHeight;
    });

    const fileName = `${docName}.pdf`;
    doc.save(fileName);
  };

  const exportToExcel = () => {
    let sheetData = [columns.map((col) => col.title), ...data];
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const fileData = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([fileData], { type: "application/octet-stream" });
    saveAs(blob, `${docName}.xlsx`);
  };

  const handleMenuClick = (e) => {
    switch (e.key) {
      case "excel":
        exportToExcel();
        break;
      case "pdf":
        exportToPDF();
        break;
      case "csv":
        exportToCSV();
        break;
      case "json":
        exportToJSON();
        break;
      default:
        break;
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="excel">Excel</Menu.Item>
      <Menu.Item key="pdf">PDF</Menu.Item>
      <Menu.Item key="csv">CSV</Menu.Item>
      <Menu.Item key="json">JSON</Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <FwButton color="secondary" >
      <DownOutlined  style={{marginRight:10}} />  Export
      </FwButton>
    </Dropdown>
  );
};

export default ExportData;
