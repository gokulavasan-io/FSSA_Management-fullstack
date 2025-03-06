import React, { useEffect, useState } from "react";
import Graph from "./Graph";
import { Row, Col } from "antd";
import useHomeContext from "../../../../Context/HomeContext";
import { fetchMonthlyReport } from "../../../../api/homeAPI";

function MonthlyAnalytics() {
  const { sectionColors } = useHomeContext();
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
      try {
        const response = await fetchMonthlyReport(4, null);
        setMonths(response.months);
        setData(transformMonthlyData(response.data));
      } catch (error) {
        console.error("Error fetching subject report data:", error);
      }
    };
    fetchData();
  }, []);

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
