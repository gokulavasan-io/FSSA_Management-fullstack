import React from 'react';
import { Select } from 'antd';
const { Option } = Select;

const SubjectMultiSelect = ({ subjects, selectedSubjects, setSelectedSubjects,width }) => {

  const filteredSubjects = subjects.filter(
    (subject) => subject.subject_name !== "Attendance" && subject.subject_name !== "Behavior"
  );

  const handleChange = (value) => {
    if (value.length === 0) {
      alert("At least 1 subject should be selected");
      return;
    }
    setSelectedSubjects(value);
  };

  return (
    <Select
      mode="multiple"
      placeholder="Select subjects"
      value={selectedSubjects.filter(id =>
        filteredSubjects.some(subject => subject.id === id)
      )} 
      onChange={handleChange}
      style={{ width: width }}
    >
      {filteredSubjects.map((subject) => (
        <Option key={subject.id} value={subject.id}>
          {subject.subject_name}
        </Option>
      ))}
    </Select>
  );
};

export default SubjectMultiSelect;
