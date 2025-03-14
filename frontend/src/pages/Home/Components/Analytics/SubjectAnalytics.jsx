import React, { useEffect, useState } from "react";
import Graph from "./Graph";
import { Row, Col } from "antd";
import { fetchSubjectReport } from "../../../../api/homeAPI";
import { sectionColors } from "../../../../constants/colors";
import {useMainContext} from "../../../../Context/MainContext"

function SubjectAnalysis() {

  const {batchNumber,academicSubjects}=useMainContext()
  const [data, setData] = useState({});
  const [months, setMonths] = useState([]);
  
  const transformSubjectData = (subjectsData) => {
    let transformedData = {};
    Object.keys(subjectsData).forEach((subject) => {
      transformedData[subject] = Object.keys(subjectsData[subject]).map((section) => ({
        name: section=="All"?"All":`Class ${section}`,
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
        if(!batchNumber||!academicSubjects) return;
        const response = await fetchSubjectReport(batchNumber,academicSubjects.map(s=>s.id));
        setMonths(response.months);
        setData(transformSubjectData(response.SubjectsData));
      } catch (error) {
        console.error("Error fetching subject report data:", error);
      }
    };
    fetchData();
  }, [academicSubjects]);
  

  return (
    <Row gutter={[16, 16]}>
      {academicSubjects.map((subject) => (
        <Col key={subject.subject_name} span={12}>
          <Graph title={subject.subject_name} months={months} data={data[subject.subject_name]} chartHeight={225} marginTop={32} />
        </Col>
      ))}
    </Row>
  );
}

export default SubjectAnalysis;


