import React, { useEffect, useState } from "react";
import {Highcharts,HighchartsReact} from "../../../utils/highChartsImports"
import { categoryMark } from "../../../constants/constValues";

export default function PieChartWithClick(props) {
  const {testTableData,mainTableData,isMainTable}=props;

  const [data, setData] = useState([]);
  const [categories, setCategories] = useState({
    [categoryMark.redRange]: [],
    [categoryMark.yellowRange]: [],
    [categoryMark.greenRange]: [],
    [categoryMark.absent]: [],
  });

  useEffect(() => {
    let data = [];
    Object.keys(categories).forEach(category => {
      let count=categories[category].length ;
      data.push({ name: `${category} - ${count}`, y: count });
    });
    setData(data);
  }, [categories]);

  useEffect(() => {
    let tableData=isMainTable?mainTableData:testTableData;
    const updatedCategories = {
      [categoryMark.redRange]: [],
      [categoryMark.yellowRange]: [],
      [categoryMark.greenRange]: [],
      [categoryMark.absent]: [],
    };

    tableData.forEach(student => {
      let name = student[0];
      let mark = isMainTable? Math.round(Number(student[1])):Math.round(Number(student[2]));

      if (student[2] === "Absent") {
        updatedCategories[categoryMark.absent].push({ name, mark });
      } else if (mark >= categoryMark.greenStartValue) {
        updatedCategories[categoryMark.greenRange].push({ name, mark });
      } else if (mark >= categoryMark.yellowStartValue) {
        updatedCategories[categoryMark.yellowRange].push({ name, mark });
      } else {
        updatedCategories[categoryMark.redRange].push({ name, mark });
      }
    });

    setCategories(updatedCategories);
  }, [mainTableData,testTableData]);

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
    credits: {
      enabled: false, 
    },
    colors: ['red', '#FFEB3B', 'green', 'rgb(183, 131, 20)'],

  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
