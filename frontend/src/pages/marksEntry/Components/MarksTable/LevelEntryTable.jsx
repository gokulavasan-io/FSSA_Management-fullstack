import React, { useEffect, useCallback, useRef } from "react";
import axios from "axios";
import Handsontable from 'handsontable';
import { HotTable } from '@handsontable/react';
import { Typography, Button, Space, Card } from "antd";
import { ReloadOutlined, SaveOutlined } from "@ant-design/icons";
import API_PATHS from "../../../../constants/apiPaths.js";
import { levelRegex } from "../../../../constants/regex.js";
import "../../styles/MarksEntry.css";
import { useMarksContext } from "../../../../Context/MarksContext.jsx";

function LevelTestTable() {
  const {
    testId,
    testTableData,
    setTestTableData,
    isUpdated,
    setIsUpdated,
    isEdited,
    setIsEdited,testDetail
  } = useMarksContext();
  const hotTableRef = useRef(null);

  const testTableColumns = [
    { title: "Student", width: 200, readOnly: true },
    { title: "Level", width: 100, editor: "text" },
    { title: "Remark", width: 100 },
  ];

  const transformMarksData = (data) => ({
    studentsMark: Object.values(data).map((item) => ({
      student_id: item.student_id,
      level: item.level !== "" ? item.level : null,
      remark: item.remark || "",
    })),
  });

  const handleUpdate = () => {
    const formattedData = transformMarksData(testTableData);

    axios
      .put(`${API_PATHS.UPDATE_LEVEL}${testId}/`, formattedData)
      .then((response) => {
        console.log("Marks data updated successfully!", response.data);
        setIsUpdated((prev) => !prev);
      })
      .catch((error) => {
        console.error("Error submitting marks data:", error.message);
        alert("Something went wrong. Try again later.");
      });
  };

  const handleDataChange = useCallback((changes) => {
    if (!changes) return;
    const instance = hotTableRef.current.hotInstance;

    setTestTableData((prevData) => {
      const updatedData = { ...prevData };

      changes.forEach(([row, col, , newValue]) => {
        const sortedRowIndex = instance.toPhysicalRow(row);
        const studentId = Object.keys(prevData)[sortedRowIndex];

        const field = col === 0 ? "student_name" : col === 1 ? "level" : "remark";
        updatedData[studentId][field] = newValue;
      });

      setIsEdited(true);
      return updatedData;
    });
  }, []);

  const handleBeforeChange = (changes) => {
    if (!changes) return;

    for (let i = 0; i < changes.length; i++) {
      const [row, col, oldValue, newValue] = changes[i];

      if (col == 1) {
        if (levelRegex.test(newValue) || newValue == "" || !newValue) {
          changes[i][3] = newValue;
        } else {
          alert("Invalid input. It must be from 1 to 10.");
          changes[i][3] = oldValue;
        }
      }
    }
  };

  const handleReset = async () => {
    try {
      const initialData = await fetchData();
      setTestTableData(initialData);
      setIsEdited(false);
    } catch (error) {
      console.error("Error in handleReset:", error);
    }
  };

  useEffect(() => {
    setIsEdited(false);
  }, [testId, isUpdated]);

  const fetchData = async () => {
    try {
      const apiUrl = `${API_PATHS.GET_LEVEL}${testId}/`;
      const response = await axios.get(apiUrl);
      console.log(response.data);
      return response.data.marks;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  const cellRenderer = function (instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    if (col == 1) td.classList.add("cell-center");
    if (col === 0 || col === 1 || col === 2) td.classList.add("cell-names");
  };

  useEffect(() => {
    (async () => {
      try {
        const initialData = await fetchData();
        setTestTableData(initialData);
      } catch (error) {
        console.error("Error in useEffect:", error);
      }
    })();
  }, [testId]);

  return (
    <div style={{display:'flex',flexDirection:"column",alignItems:"center",marginTop:12}}>
      <Typography.Title level={5} style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center",width:"90%", }}>
        <Space>
          <span style={{color:"#1677ff"}}>Level</span>
        </Space>
        <Space>
          <Button
            size="small"
            variant="text"
            color="red"
            icon={<ReloadOutlined />}
            onClick={handleReset}
            disabled={!isEdited}
          >
            Reset 
          </Button>
          <Button
            size="small"
            color="primary" 
            variant="text"
            
            icon={<SaveOutlined />}
            onClick={handleUpdate}
            disabled={!isEdited}
          >
            Save
          </Button>
        </Space>
      </Typography.Title>

      <HotTable
        ref={hotTableRef}
        data={Object.values(testTableData).map(({ student_name, level, remark }) => [
          student_name,
          level,
          remark,
        ])}
        colHeaders={testTableColumns.map((col) => col.title)}
        columns={testTableColumns}
        width="90%"
        height="700"
        autoRowSize={true}
        licenseKey="non-commercial-and-evaluation"
        afterChange={handleDataChange}
        beforeChange={handleBeforeChange}
        rowHeaders={true}
        columnSorting={true}
        stretchH="all"
        cells={(row, col) => {
          return { renderer: cellRenderer };
        }}
      />
    </div>
  );
}

export default LevelTestTable;
