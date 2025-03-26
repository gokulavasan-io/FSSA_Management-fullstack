import React, { useEffect, useState } from "react";
import Graph from "./Graph";
import { fetchMonthlyReport } from "../../../../api/homeAPI";
import {sectionColors} from '../../../../constants/colors'
import { useMainContext } from "../../../../Context/MainContext";

function MonthlyAnalytics() {
  
  const{batchNumber,academicSubjects}=useMainContext()
  const [data, setData] = useState({});
  const [months, setMonths] = useState([]);

  const transformMonthlyData = (data) => {
    return Object.keys(data).map((section) => ({
      name: section=="All"?"All":`Class ${section}`,
      data: data[section],
      color: sectionColors[section] || "#000",
      marker: { symbol: "circle" },
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      if(!batchNumber||!academicSubjects.length) return;
      try {
        const response = await fetchMonthlyReport(batchNumber,academicSubjects.map(s=>s.id));
        setMonths(response.months);
        setData(transformMonthlyData(response.data));
      } catch (error) {
        console.error("Error fetching subject report data:", error);
      }
    };
    fetchData();
  }, [academicSubjects,batchNumber]);

  return (
    <Graph
      title={"Monthly Analytics"}
      months={months}
      data={data}
      marginTop={20}
      chartHeight={280}
      cardHeight={350}
    />
  );
}

export default MonthlyAnalytics;
