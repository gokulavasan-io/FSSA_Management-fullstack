import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { MenuItem, Menu, Button } from '../../utils/materialImports';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ExportData = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const { testTableData, testTableColumns, mainTableData, mainTableColumns, isMainTable, totalMark, testName, subject, month, section } = props;

  let data;
  let columns;
  let docName;

  if (isMainTable) {
    data = mainTableData;
    columns = mainTableColumns;
    docName = `${month} - ${subject} - ${section}`;
  } else {
    data = testTableData;
    columns = testTableColumns;
    docName = `${testName} -${month} - ${subject} - ${section}`;
  }

  const exportToCSV = () => {
    setIsOpen(!isOpen);
    const csv = data.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${docName}.csv`;
    link.click();
  };

  const exportToJSON = () => {
    setIsOpen(!isOpen);
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${docName}.json`;
    link.click();
  };

  const exportToPDF = () => {
    setIsOpen(!isOpen);
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageMargin = 20;
    const availableWidth = pageWidth - pageMargin * 2;
    const startX = pageMargin;
    const startY = 20;
    const rowHeight = 10;
    const headingFontSize = 16;
    const bodyFontSize = 8;

    doc.setFontSize(headingFontSize);
    doc.text(docName, pageWidth / 2, 10, { align: "center" });

    const headers = columns.map((col) => col.title);

    let columnWidths = columns.map((col, index) => {
      let maxLength = headers[index].length;
      data.forEach((row) => {
        const cellValue = row[index] != null ? row[index].toString() : "";
        maxLength = Math.max(maxLength, cellValue.length);
      });
      return Math.max(maxLength * 6, 40);
    });

    const totalTableWidth = columnWidths.reduce((a, b) => a + b, 0);

    if (totalTableWidth > availableWidth) {
      const scalingFactor = availableWidth / totalTableWidth;
      columnWidths = columnWidths.map((width) => width * scalingFactor);
    }

    doc.setFontSize(bodyFontSize);

    let currentX = startX;
    headers.forEach((header, index) => {
      doc.text(header, currentX, startY);
      currentX += columnWidths[index];
    });

    data.forEach((row, rowIndex) => {
      let currentX = startX;
      const currentY = startY + (rowIndex + 1) * rowHeight;
      row.forEach((cell, colIndex) => {
        const cellText = cell != null ? cell.toString() : "";
        doc.text(cellText, currentX, currentY);
        currentX += columnWidths[colIndex];
      });
    });
    const fileName = `${docName}.pdf`;
    doc.save(fileName);
  };

  const exportToExcel = () => {
    
    let sheetData= [columns.map((col) => col.title),...data]
    
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData); 
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Create a file and trigger download
    const fileName = `${docName}.xlsx`; // Set filename dynamically
    const fileData = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Use FileSaver to save the file locally
    const blob = new Blob([fileData], { type: 'application/octet-stream' });
    saveAs(blob, fileName);
  };

  return (
    <div style={{ position: 'relative' }}>
      <Button
  size="small"
  variant="contained"
  sx={{
    backgroundColor: "#ffcc00", 
    color: "black",  "&:hover": { backgroundColor:"#ffb300" , color: "black" }, 
  }}
  onClick={() => setIsOpen(!isOpen)}
>
  Export
</Button>


      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            border: '1px solid #ccc',
            backgroundColor: 'white',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            width: '100%',
          }}
        >
          <div onClick={exportToExcel} style={{ padding: '10px', cursor: 'pointer' }}>
            Excel
          </div>
          <div onClick={exportToPDF} style={{ padding: '10px', cursor: 'pointer' }}>
            PDF
          </div>
          <div onClick={exportToCSV} style={{ padding: '10px', cursor: 'pointer' }}>
            CSV
          </div>
          <div onClick={exportToJSON} style={{ padding: '10px', cursor: 'pointer' }}>
            JSON
          </div>
          
        </div>
      )}
    </div>
  );
};

export default ExportData;
