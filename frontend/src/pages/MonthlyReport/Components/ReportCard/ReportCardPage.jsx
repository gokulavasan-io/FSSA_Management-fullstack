import React, { useState } from "react";
import ReportCard from "./ReportCard";
import { AutoComplete, Row, Col, Space } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import downloadReportCard from "./downloadReportCard";
import SubjectMultiSelect from "../SubjectDropdown";
import { FwButton } from "@freshworks/crayons/react";

function ReportCardPage(props) {
  let {
    handleNextStudent,
    handlePrevStudent,
    studentData,
    currentStudentIndex,
    componentRef,
    studentNames,
    setDownloadReportCardPage,
    handleSearchStudent,
    subjects,
    selectedSubjects,
    setSelectedSubjects,
    attendanceBehaviorIds,formatStudentsData,studentsData,setStudentData,classData
  } = props;

  const [searchValue, setSearchValue] = useState("");
  const [isDownloadingAll,setIsDownloadingAll]=useState(false)

  const handleDownloadAll = async () => {
    setIsDownloadingAll(true);
    for (const name of studentNames) {
      const formattedStudentData = formatStudentsData(
        studentsData[name],
        classData,
        name
      );
  
      setStudentData(formattedStudentData);
  
      await new Promise((resolve) => setTimeout(resolve, 500)); 
  
      await downloadReportCard(componentRef, name, studentsData[name]?.section);
  
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  
    setIsDownloadingAll(false);
  };
  

  return (
    <>
      <Row align="stretch">
        <Col span={12}>
          <Space direction="horizontal" align="top" size="large">
            <FwButton onFwClick={() => setDownloadReportCardPage(false)}  >
              <ArrowLeftOutlined style={{ marginRight: 8 }} /> Back
            </FwButton>
            <ReportCard ref={componentRef} studentData={studentData} />
          </Space>
        </Col>

        <Col
          span={12}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "end",
          }}
        >
          <Space direction="vertical" size="large" style={{ width: "400px" }}>
            <AutoComplete
              options={studentNames
                .filter((name) =>
                  name.toLowerCase().includes(searchValue.toLowerCase())
                )
                .map((name) => ({ value: name }))}
              style={{ width: "100%" }}
              placeholder="Search Student"
              value={searchValue}
              onChange={setSearchValue}
              onSelect={(value) => {
                handleSearchStudent(value);
                setSearchValue(value);
              }}
              allowClear
            />

            <SubjectMultiSelect
              width="100%"
              subjects={subjects}
              selectedSubjects={selectedSubjects}
              setSelectedSubjects={(value) => {
                const finalSubjects = [
                  ...new Set([...value, ...attendanceBehaviorIds]),
                ];
                setSelectedSubjects(finalSubjects);
              }}
            />
          </Space>

          <Space
            direction="horizontal"
            style={{
              width: "100%",
              justifyContent: "center",
              paddingTop: "20px",
              paddingBottom: "20px",
            }}
          >
            <FwButton
              color="secondary"
              onFwClick={handlePrevStudent}
              disabled={currentStudentIndex === 0 || isDownloadingAll}
            >
              Previous Student
            </FwButton>
            <FwButton
              onFwClick={() =>
                downloadReportCard(componentRef, studentData.names?.Student, studentData.sec_mon_year?.Section)
              }
              disabled={isDownloadingAll}
            >
              Download
            </FwButton>
            <FwButton
              color="secondary"
              onFwClick={handleNextStudent}
              disabled={currentStudentIndex === studentNames.length - 1||isDownloadingAll }
            >
              Next Student
            </FwButton>

            <FwButton color="danger" onFwClick={handleDownloadAll} loading={isDownloadingAll} >
              Download For All Students
            </FwButton>
          </Space>
        </Col>
      </Row>
    </>
  );
}

export default ReportCardPage;
