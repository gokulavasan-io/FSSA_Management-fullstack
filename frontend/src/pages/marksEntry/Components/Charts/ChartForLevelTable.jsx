import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMarksContext } from "../../../../Context/MarksContext";
import { Card, Typography } from "antd";
import Accessibility from "highcharts/modules/accessibility";

// Initialize the module
Accessibility(Highcharts);
const { Title, Text } = Typography;

export default function ChartForLevelTable() {
  const { testTableData } = useMarksContext();
  const [data, setData] = useState([]);
  
  useEffect(() => {
    if (Array.isArray(testTableData) && testTableData.length > 0) {
      let levelCounts = {};
      
      testTableData.forEach(({ level }) => {
        const levelNumber = level ? parseInt(level) : 0;
        levelCounts[levelNumber] = (levelCounts[levelNumber] || 0) + 1;
      });

      const chartData = Object.entries(levelCounts).map(([level, count]) => ({
        name: level === "0" ? "No level" : `Lvl ${level} - ${count}`,
        y: count,
      }));

      setData(chartData);
    }
  }, [testTableData]);

  const options = {
    chart: {
      type: "pie",
      height: 250,
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
        showInLegend: true, // Use default legend
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
          Level Distribution
        </Title>
        <Title level={5} style={{ margin: "0" }}>
          <hr />
        </Title>
      </div>

      {/* Chart Section */}
      <div style={{ maxWidth: "320px", width: "100%", margin: "auto", height: "50%" }}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </Card>
  );
}
