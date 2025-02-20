import React, { useEffect, useState } from "react";
import "highcharts/modules/accessibility";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Accessibility from "highcharts/modules/accessibility";

// Initialize the module
import { useMarksContext } from "../../../../Context/MarksContext";
import { categoryMark } from "../../../../constants/constValues";
import { Card, Typography } from "antd";

const { Title, Text } = Typography;
Accessibility(Highcharts);

export default function NormalTestChart() {
  const { testTableData, mainTableData, isMainTable } = useMarksContext();

  const [data, setData] = useState([]);
  const [categories, setCategories] = useState({
    [categoryMark.redRange]: [],
    [categoryMark.yellowRange]: [],
    [categoryMark.greenRange]: [],
    [categoryMark.absent]: [],
    withoutMarks: [],
  });

  useEffect(() => {
    let filteredData = [];

    Object.keys(categories).forEach((category) => {
      if (
        (isMainTable && category === categoryMark.absent || isMainTable && category === "withoutMarks")
        
      )
        return;

      const count = categories[category].length;
      filteredData.push({ name: `${category} - ${count}`, y: count });
    });

    setData(filteredData);
  }, [categories, isMainTable]);

  useEffect(() => {
    let tableData = isMainTable ? mainTableData : testTableData;
    
    if (!Array.isArray(tableData)) {
      console.warn("Invalid tableData format:", tableData);
      return;
    }
  
    const updatedCategories = {
      [categoryMark.redRange]: [],
      [categoryMark.yellowRange]: [],
      [categoryMark.greenRange]: [],
      [categoryMark.absent]: [],
      withoutMarks: [],
    };
  
    tableData.forEach((student) => {
      let name = student.student_name;
      let mark = isMainTable ? student[1] : student.average_mark;
  
      if (mark === "Absent") {
        updatedCategories[categoryMark.absent].push({ name, mark });
      } else if (mark === "" || mark === null) {
        updatedCategories.withoutMarks.push({ name, mark });
      } else if (mark >= categoryMark.greenStartValue) {
        updatedCategories[categoryMark.greenRange].push({ name, mark });
      } else if (mark >= categoryMark.yellowStartValue) {
        updatedCategories[categoryMark.yellowRange].push({ name, mark });
      } else {
        updatedCategories[categoryMark.redRange].push({ name, mark });
      }
    });
  
    setCategories(updatedCategories);
  }, [mainTableData, testTableData, isMainTable]);
  

  const colors = ["red", "rgb(234, 226, 85)", "green", "rgb(183, 131, 20)", "rgb(22, 212, 249)"];

  const options = {
    chart: {
      type: "pie",
      height: 150, 
    },
    title: {
      text: null,
    },
    tooltip: {
      pointFormat:
        "{series.name}: <b>{point.percentage:.1f}%</b><br/>count: <b>{point.y}</b>",
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        size: "100%", 
        showInLegend: false, 
        dataLabels: {
          enabled: false,
        },
      },
    },
    series: [
      {
        name: "Percent",
        colorByPoint: true,
        data: data,
      },
    ],
    accessibility: {
      enabled: true,
    },
    credits: {
      enabled: false,
    },
    colors: colors,
  };

  return (
    <Card
      style={{
        maxWidth: "300px",
        overflow: "hidden", 
        borderRadius: "16px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Title Section */}
      <div>
        <Text type="secondary" style={{ fontSize: "14px" }}>
          Statistics
        </Text>
        <Title level={4} style={{ margin: "0" }}>
          Mark Category
        </Title>
        <Title level={5} style={{ margin: "0" }}>
          <hr/>
        </Title>
      </div>

      {/* Chart Section */}
      <div style={{ maxWidth: "320px", width: "100%", margin: "auto",height:"50%" }}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>

      {/* Custom Legend Section */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {data.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              margin: "4px 10px",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                backgroundColor: colors[index],
                borderRadius: "50%",
                marginRight: "6px",
                
              }}
            ></div>
            <Text style={{ fontSize: "12px" }}>{item.name}</Text>
          </div>
        ))}
      </div>
    </Card>
  );
}
