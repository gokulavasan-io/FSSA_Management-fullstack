import React, { useEffect, useCallback, useRef } from "react";
import Handsontable from 'handsontable';
import { HotTable } from '@handsontable/react';
import { Button, Typography, Space } from 'antd';
import { ReloadOutlined, SaveOutlined } from '@ant-design/icons';
import { fetchTestData, updateMarks } from "../../../../api/marksAPI.js";
import { useMarksContext } from "../../../../Context/MarksContext.jsx";
import TestDetailCard from "../TestDetailCard/TestDetailsCard.jsx";
import InfoButton from "../TestDetailCard/InfoButton.jsx";

function TestTable() {
  const {
    testTableData,
    setTestTableData,
    totalMark,
    setTotalMark,
    isEdited,
    setIsEdited,
    testId,
    setIsUpdated,
    categoryMark,
    isUpdated,
    setTestDetail,
    testDetail,
  } = useMarksContext();
  const hotTableRef = useRef(null);

  const calculateMarksOutOf100 = (marks) => {
    if (marks === "A" || marks === "a") return "Absent";
    if (!marks || isNaN(marks)) return "";
    return ((parseFloat(marks) / totalMark) * 100).toFixed(2);
  };

  const handleUpdate = async () => {
    try {
      await updateMarks(testId, { studentsMark: testTableData });
      setIsUpdated(true);
    } catch (error) {
      console.error("Error submitting marks data:", error.message);
      alert("Something went wrong. Try again later.", "error");
    }
  };

  const handleDataChange = useCallback(
    (changes) => {
      if (!changes) return;

      setTestTableData((prevData) => {
        const updatedData = [...prevData];
        const hotInstance = hotTableRef.current.hotInstance;

        changes.forEach(([visualRow, prop, oldValue, newValue]) => {
          const physicalRow = hotInstance.toPhysicalRow(visualRow);
          updatedData[physicalRow] = {
            ...updatedData[physicalRow],
            [prop]: newValue,
          };

          if (prop === "mark") {
            updatedData[physicalRow].average_mark =
              calculateMarksOutOf100(newValue);
          }
        });
        setIsEdited(true);
        return updatedData;
      });
    },
    [calculateMarksOutOf100]
  );

  const handleBeforeChange = (changes) => {
    if (!changes) return;

    const hotInstance = hotTableRef.current.hotInstance;
    let shouldCancelChange = false;

    for (let i = 0; i < changes.length; i++) {
      const [visualRow, prop, oldValue, newValue] = changes[i];

      if (prop === "mark") {
        if (newValue?.toLowerCase() === "a") {
          changes[i][2] = "Absent";
          continue;
        }

        const mark = parseFloat(newValue);
        if (mark > totalMark) {
          alert("Enter mark less than or equal to total mark", "error");
          shouldCancelChange = true;
        } else if (mark < 0) {
          alert("Enter a positive number", "error");
          shouldCancelChange = true;
        } else if (newValue !== "" && isNaN(mark)) {
          alert('Only "a" or "A" are allowed!', "error");
          shouldCancelChange = true;
        }

        if (shouldCancelChange) {
          setTimeout(() => {
            hotInstance.selectCell(visualRow, prop);
            hotInstance.setDataAtCell(visualRow, prop, oldValue);
          }, 0);
          return false;
        }

        if (/^0\d+$/.test(newValue)) {
          changes[i][2] = newValue.replace(/^0+/, "");
        }
      }
    }
  };

  const cellRenderer = function (instance, td, row, col, prop, value) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    td.classList.remove("cell-red", "cell-yellow", "cell-green");

    if (prop === "average_mark" && value !== "" && !isNaN(value)) {
      const averageMark = Math.round(parseFloat(value));
      if (averageMark <= categoryMark.redEndValue) {
        td.classList.add("cell-red");
      } else if (averageMark <= categoryMark.yellowEndValue) {
        td.classList.add("cell-yellow");
      } else {
        td.classList.add("cell-green");
      }
    }
    if (prop === "average_mark" && value == "Absent") {
      td.classList.remove("cell-red", "cell-yellow", "cell-green");
      td.classList.add("cell-absent");
    }
    if (prop === "average_mark" || prop === "mark") {
      td.classList.add("cell-center");
    }
    if (prop === "student_name" || prop === "mark" || prop == "remark") {
      td.classList.add("cell-names");
    }
  };

  const handleReset = async () => {
    try {
      const initialData = await fetchTestData(testId);
      
      setTestTableData(initialData);
      setIsEdited(false);
    } catch (error) {
      console.error("Error in handleReset:", error);
    }
  };

  useEffect(() => {
    setIsEdited(false);
  }, [testId, isUpdated]);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetchTestData(testId);
        setTotalMark(response.test_detail.total_marks);
        setTestDetail(response.test_detail);
        setTestTableData(response.marks);
      } catch (error) {
        console.error("Error in useEffect:", error);
      }
    })();
  }, [testId]);

  return (
    <div style={{display:'flex',flexDirection:"column",alignItems:"center",marginTop:12}}>
      <TestDetailCard />
      <Typography.Title level={5} style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center",width:"90%", }}>
        <Space>
          <InfoButton />
          <span style={{color:"#1677ff"}}>{testDetail.test_name}</span>
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
        data={testTableData}
        columns={[
          { data: "student_name", title: "Student Name",readOnly:true },
          { data: "mark", title: `Mark (${totalMark})` },
          { data: "average_mark", title: `Average`,readOnly:true },
          { data: "remark", title: "Remark" },
        ]}
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

export default TestTable;
