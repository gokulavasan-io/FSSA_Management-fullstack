import React, { useEffect, useState } from "react";
import { Highcharts, HighchartsReact } from "../../../utils/highChartsImports";
import "highcharts/modules/accessibility";
import { useMarksContext } from "../contextFile";

export default function levelTestChart() {
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
    },
    title: {
      text: null,
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b><br/>count: <b>{point.y}</b>",
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        showInLegend: true,
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
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
