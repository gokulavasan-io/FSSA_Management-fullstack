import React, { useEffect, useState } from "react";
import {Highcharts,HighchartsReact} from "../../../utils/highChartsImports"
import "highcharts/modules/accessibility";
import { useMarksContext } from "../contextFile";

export default function Chart() {
  
    let {testTableData}=useMarksContext()

    const [data, setData] = useState([])
    useEffect(()=>{
      console.log(testTableData);
      let onlyLevels=[];
      testTableData.forEach(level => {
        onlyLevels.push(Number(level[1]))
      });
      setData(onlyLevels)

    },[testTableData])
    
    let count={}
    data.forEach(level=>{
        count[level]=(count[level]||0)+1;
    })
    
    let finalData=[];
    for(let level in count){
      finalData.push({ name: `${level==0?"No level": `Lvl ${level}`} - ${count[level]}`, y: count[level] });
    }
  
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
        data: finalData,
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
