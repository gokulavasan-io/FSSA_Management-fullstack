import React, { useEffect, useState } from "react";
import { Highcharts, HighchartsReact } from "../../../utils/highChartsImports";
import { categoryMark } from "../../../constants/constValues";
import "highcharts/modules/accessibility";
import { useMarksContext } from "../contextFile";

export default function NormalTestChart() {
  const { testTableData, mainTableData, isMainTable } = useMarksContext();

  const [data, setData] = useState([]);
  const [categories, setCategories] = useState({
    [categoryMark.redRange]: [],
    [categoryMark.yellowRange]: [],
    [categoryMark.greenRange]: [],
    [categoryMark.absent]: [],
    withoutMarks: [],  // New category for missing marks
  });

  useEffect(() => {
    let filteredData = [];

    // Exclude "Absent" category if it's a main table
    Object.keys(categories).forEach((category) => {
      if (isMainTable && category === categoryMark.absent|| category===categoryMark.withoutMarks) return;
      
      const count = categories[category].length;
      filteredData.push({ name: `${category} - ${count}`, y: count });
    });

    setData(filteredData);
  }, [categories, isMainTable]);

  useEffect(() => {
    let tableData = isMainTable ? mainTableData : testTableData;
    const updatedCategories = {
      [categoryMark.redRange]: [],
      [categoryMark.yellowRange]: [],
      [categoryMark.greenRange]: [],
      [categoryMark.absent]: [],
      withoutMarks: [], // Initialize new category
    };

    tableData.forEach((student) => {
      let name = student.student_name;
      let mark = isMainTable ? student[1] : student.average_mark;

      if (mark === "Absent") {
        updatedCategories[categoryMark.absent].push({ name, mark });
      } else if (mark === "" || mark === null) {
        updatedCategories.withoutMarks.push({ name, mark }); // Add to missing marks
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
    colors: ['red', '#FFEB3B', 'green', 'rgb(183, 131, 20)', 'rgb(22, 212, 249)'], // Added color for missing marks
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
