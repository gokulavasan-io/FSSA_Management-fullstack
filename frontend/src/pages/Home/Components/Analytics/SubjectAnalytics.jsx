import React, { useEffect, useState } from "react";
import Graph from "./Graph";
import { Row, Col } from "antd";
import useHomeContext from "../../../../Context/HomeContext";
import { fetchSubjectReport } from "../../../../api/homeAPI";

function SubjectAnalysis() {
  const { sectionColors } = useHomeContext();
  const [data, setData] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [months, setMonths] = useState([]);
  const transformSubjectData = (subjectsData) => {
  
    let transformedData = {};
  
    Object.keys(subjectsData).forEach((subject) => {
      transformedData[subject] = Object.keys(subjectsData[subject]).map((section) => ({
        name: `Class ${section}`,
        data: subjectsData[subject][section],
        color: sectionColors[section] || "#000",
        marker: { symbol: "circle" }
      }));
    });
  
    return transformedData;
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchSubjectReport(4, null, [1,2,3,4,5,6,7,8]);
        setMonths(response.months);
        setSubjects(Object.keys(response.SubjectsData));
        setData(transformSubjectData(response.SubjectsData));
      } catch (error) {
        console.error("Error fetching subject report data:", error);
      }
    };
    fetchData();
  }, []);
  

  return (
    <Row gutter={[16, 16]}>
      {subjects.map((subject) => (
        <Col key={subject} span={12}>
          <Graph title={subject} months={months} data={data[subject]} chartHeight={225} marginTop={32} />
        </Col>
      ))}
    </Row>
  );
}

export default SubjectAnalysis;


