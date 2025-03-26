import React, { useState } from "react";
import {
  Select,
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  DatePicker,
  Row,
  Col,
} from "antd";
import { submitTestData } from "../../../../api/marksAPI.js";
import dayjs from "dayjs";
import useNotification from "../../../Components/Notification.jsx";
import { useMainContext } from "../../../../Context/MainContext.jsx";
import { FwButton } from "@freshworks/crayons/react";
const { Option } = Select;

const AddNewTest = ({ reFetchFunc }) => {
  const [openNewTestForm, setOpenNewTestForm] = useState(false);
  let { months, subjects, batchNumber } = useMainContext();
  subjects = subjects.filter((subject) => subject.subject_name != "Attendance");
  const showMessage = useNotification();

  const [formData, setFormData] = useState({
    test_name: "",
    month: "",
    subject: "",
    total_marks: "",
    about_test: "",
    created_at: "",
    isLevelTest: false,
    batch: batchNumber,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isProblemSolving, setIsProblemSolving] = useState(false);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target || e;

    if (name === "test_name") {
      setFormData((prev) => ({
        ...prev,
        [name]: value.charAt(0).toUpperCase() + value.slice(1),
      }));
    } else if (name === "subject") {
      const selectedSubject = subjects.find((subject) => subject.id === value);
      setIsProblemSolving(
        selectedSubject?.subject_name.toLowerCase().includes("problem") || false
      );
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      created_at: date ? dayjs(date).format("YYYY-MM-DD") : "",
    }));
  };

  const resetForm = () => {
    setFormData({
      test_name: "",
      month: "",
      subject: "",
      total_marks: "",
      about_test: "",
      created_at: "",
      isLevelTest: false,
      batch: batchNumber,
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    const testNameRegex = /^[A-Za-z0-9\s]+$/;

    if (!formData.test_name || !testNameRegex.test(formData.test_name)) {
      newErrors.test_name =
        "Test Name must contain only letters, numbers, and spaces.";
    }

    if (!formData.month) newErrors.month = "Please select a month";
    if (!formData.subject) newErrors.subject = "Please select a subject.";

    if (
      !formData.isLevelTest &&
      (!formData.total_marks ||
        isNaN(formData.total_marks) ||
        formData.total_marks <= 0)
    ) {
      newErrors.total_marks = "Enter a valid total mark.";
    } else if (formData.total_marks >= 1000) {
      newErrors.total_marks = "Total Marks should not be greater than 1000";
    }

    if (!formData.about_test || formData.about_test.length < 5) {
      newErrors.about_test = "About Test must be at least 5 characters long.";
    }

    if (!formData.created_at)
      newErrors.created_at = "Please select a valid date.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);

    if (formData.isLevelTest) formData.total_marks = 0;
    if (!isProblemSolving) formData.isLevelTest = false;

    try {
      const response = await submitTestData(formData);
      reFetchFunc();
      showMessage(response.message, "s");

      resetForm();

      setOpenNewTestForm(false);
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrors({ test_name: error.response.data.message });
      } else {
        showMessage("Failed to submit test data. Please try again.", "e");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FwButton color="secondary" onFwClick={() => setOpenNewTestForm(true)}>
        Add New Test
      </FwButton>
      <Modal
        title="Add New Test"
        open={openNewTestForm}
        onCancel={() => {
          setOpenNewTestForm(false);
          resetForm();
        }}
        footer={null}
        width={500}
        zIndex={10001}
      >
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Test Name"
            validateStatus={errors.test_name ? "error" : ""}
            help={errors.test_name}
          >
            <Input
              name="test_name"
              value={formData.test_name}
              onChange={handleChange}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Subject"
                validateStatus={errors.subject ? "error" : ""}
                help={errors.subject}
              >
                <Select
                  value={formData.subject}
                  onChange={(value) => handleChange({ name: "subject", value })}
                  placeholder="Select Subject"
                >
                  {subjects.map((subject) => (
                    <Option key={subject.id} value={subject.id}>
                      {subject.subject_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Month"
                validateStatus={errors.month ? "error" : ""}
                help={errors.month}
              >
                <Select
                  value={formData.month}
                  onChange={(value) => handleChange({ name: "month", value })}
                  placeholder="Select Month"
                >
                  {months.map((month) => (
                    <Option key={month.id} value={month.id}>
                      {month.month_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {!isProblemSolving ? (
            <Form.Item
              label="Total Marks"
              validateStatus={errors.total_marks ? "error" : ""}
              help={errors.total_marks}
            >
              <Input
                type="number"
                name="total_marks"
                value={formData.total_marks}
                onChange={handleChange}
              />
            </Form.Item>
          ) : (
            <Form.Item label="Test Type">
              <Checkbox
                checked={formData.isLevelTest}
                onChange={handleChange}
                name="isLevelTest"
              >
                Is Level Up Test?
              </Checkbox>
              {!formData.isLevelTest && (
                <Form.Item
                  validateStatus={errors.total_marks ? "error" : ""}
                  help={errors.total_marks}
                  style={{marginTop:10}}
                >
                  <Input
                    type="number"
                    name="total_marks"
                    value={formData.total_marks}
                    onChange={handleChange}
                    placeholder="Enter Total Marks"
                  />
                </Form.Item>
              )}
            </Form.Item>
          )}

          <Form.Item
            label="About Test"
            validateStatus={errors.about_test ? "error" : ""}
            help={errors.about_test}
          >
            <Input.TextArea
              name="about_test"
              value={formData.about_test}
              onChange={handleChange}
              rows={2}
            />
          </Form.Item>

          <Form.Item
            label="Date"
            validateStatus={errors.created_at ? "error" : ""}
            help={errors.created_at}
          >
            <DatePicker
              format="DD-MM-YYYY"
              value={
                formData.created_at
                  ? dayjs(formData.created_at, "YYYY-MM-DD")
                  : null
              }
              onChange={handleDateChange}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Row gutter={16} justify="end">
            <Col>
              <Button
                onClick={() => {
                  setOpenNewTestForm(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
            </Col>
            <Col>
              <Button type="primary" htmlType="submit" loading={loading}>
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default AddNewTest;
