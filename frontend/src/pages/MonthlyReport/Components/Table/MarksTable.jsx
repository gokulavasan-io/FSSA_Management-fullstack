import React, { useState, useEffect } from 'react';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';

const StudentScoresTable = ({ studentsData }) => {
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    // Check if studentsData has 'students' key
    if (studentsData) {
      // Convert JSON to array of objects with 'Name' as key
      const convertedData = Object.entries(studentsData).map(([name, details]) => ({
        Name: name,
        ...details.scores
      }));
      setTableData(convertedData);

      // Dynamically generate column headers
      if (convertedData.length > 0) {
        const firstRow = convertedData[0];
        const dynamicColumns = Object.keys(firstRow).map((key) => ({
          data: key,
          title: key,
          type: typeof firstRow[key] === 'number' ? 'numeric' : 'text'
        }));
        setColumns(dynamicColumns);
      }
    }
  }, [studentsData]);

  return (
    <div>
      <HotTable
        data={tableData}
        colHeaders={columns.map(col => col.title)}
        columns={columns}
        rowHeaders={true}
        width="100%"
        height="680"
        licenseKey="non-commercial-and-evaluation" 
        stretchH="all"
        manualColumnResize={false}
        manualRowResize={false}
        columnSorting={true}
        readOnly={true}
      />
    </div>
  );
};

export default StudentScoresTable;
