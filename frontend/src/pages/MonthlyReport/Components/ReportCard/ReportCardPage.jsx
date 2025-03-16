import React, { useState, useEffect } from "react";
import ReportCard from "./ReportCard";
import { AutoComplete, Row, Col, Space } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import downloadReportCard from "./downloadReportCard";
import SubjectMultiSelect from "../Dropdown/SubjectDropdown";
import { FwButton, FwCheckbox } from "@freshworks/crayons/react";
import { fetchLevels, fetchTestDetails } from "../../../../api/marksAPI";
import TestDropdown from '../Dropdown/TestDropdown'
import { useMainContext } from "../../../../Context/MainContext";

function ReportCardPage(props) {
    const { subjects, attendanceBehaviorIds,selectedMonth,problemSolvingId } = useMainContext();
  
  let {
    handleNextStudent,
    handlePrevStudent,
    studentData,
    currentStudentIndex,
    componentRef,
    studentNames,
    setDownloadReportCardPage,
    handleSearchStudent,
    selectedSubjects,
    setSelectedSubjects,
    formatStudentsData,
    studentsData,
    setStudentData,
    classData,
  } = props;

  const [searchValue, setSearchValue] = useState("");
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [psLevel, setPsLevel] = useState(false);
  const [levelData, setLevelData] = useState({});
  const [testDetails, setTestDetails] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null); 

  useEffect(() => {
      (async () => {
        const response = await fetchTestDetails(selectedMonth.id,problemSolvingId);
        setTestDetails(response);
      })();
  }, [psLevel]);

  useEffect(() => {
    if (!selectedTest) return
    (async () => {
      const response= await fetchLevels(selectedTest.test_detail.id)
      const result = response?.marks.reduce((acc, curr) => {
        acc[curr.student_name] = Number(curr.level);
        return acc;
      }, {});
      setLevelData(result)
    })();
  }, [selectedTest])


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
            <FwButton onFwClick={() => setDownloadReportCardPage(false)}>
              <ArrowLeftOutlined style={{ marginRight: 8 }} /> Back
            </FwButton>
            <ReportCard ref={componentRef} studentData={studentData} isPSLevel={psLevel} levelData={levelData}   />
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
            <FwCheckbox
              checked={psLevel}
              onClick={() => setPsLevel((value) => !value)}
              description="Include Problem solving level"
            >
              PS level
            </FwCheckbox>

            {psLevel  && testDetails.length >0 && (
              <TestDropdown testDetails={testDetails}  selectedTest={selectedTest}  setSelectedTest={setSelectedTest} />
            )}
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
                downloadReportCard(
                  componentRef,
                  studentData.names?.Student,
                  studentData.sec_mon_year?.Section
                )
              }
              disabled={isDownloadingAll}
            >
              Download
            </FwButton>
            <FwButton
              color="secondary"
              onFwClick={handleNextStudent}
              disabled={
                currentStudentIndex === studentNames.length - 1 ||
                isDownloadingAll
              }
            >
              Next Student
            </FwButton>

            <FwButton
              color="danger"
              onFwClick={handleDownloadAll}
              loading={isDownloadingAll}
            >
              Download For All Students
            </FwButton>
          </Space>
        </Col>
      </Row>
    </>
  );
}

export default ReportCardPage;
