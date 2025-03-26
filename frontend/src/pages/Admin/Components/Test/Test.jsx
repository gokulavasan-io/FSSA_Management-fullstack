import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Select,
} from "antd";
import {
  getTestDetails,
  updateTest,
  deleteTest,
} from "../../../../api/marksAPI";
import { format } from "date-fns";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import { useMainContext } from "../../../../Context/MainContext";
import AddNewTest from "./NewTest";
import { FwButton } from "@freshworks/crayons/react";

const TestDetailsTable = () => {
  let { months, subjects } = useMainContext();
  subjects = subjects.filter((subject) => subject.subject_name != "Attendance");

  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [form] = Form.useForm();
  const [isLevelTest, setIsLevelTest] = useState(false);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const data = await getTestDetails();
      setTests(data);
    } catch (error) {
      console.error("Failed to load test details", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setSelectedTest(record);
    setIsLevelTest(record.isLevelTest); // Store isLevelTest state
    form.setFieldsValue({
      test_name: record.test_name,
      total_marks: record.isLevelTest ? "N/A" : record.total_marks,
      about_test: record.about_test,
      month: record.month.id,
      subject: record.subject.id,
      created_at: record.created_at ? dayjs(record.created_at) : null,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (testId) => {
    try {
      await deleteTest(testId);
      fetchTests();
    } catch (error) {
      console.error("Failed to delete test");
    }
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      await updateTest(selectedTest.id, {
        ...values,
        total_marks: isLevelTest ? 0 : values.total_marks,
        created_at: values.created_at ? values.created_at.toISOString() : null,
      });
      setIsModalOpen(false);
      fetchTests();
    } catch (error) {
      console.error("Failed to update test", error);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "test_name",
      key: "name",
    },
    {
      title: "Month",
      dataIndex: ["month", "name"],
      key: "month",
    },
    {
      title: "Subject",
      dataIndex: ["subject", "name"],
      key: "subject",
    },
    {
      title: "Total Mark",
      dataIndex: "total_marks",
      key: "total_mark",
      render: (_, record) =>
        record.isLevelTest ? "Level Up" : record.total_marks,
    },
    {
      title: "About Test",
      dataIndex: "about_test",
      key: "about_test",
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "date",
      render: (date) => (date ? format(new Date(date), "dd/MMM/yy") : "N/A"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <div
        style={{
          marginBottom: 10,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <AddNewTest reFetchFunc={fetchTests} buttonType={"primary"} />
      </div>
      <Table
        dataSource={tests}
        columns={columns}
        loading={loading}
        rowKey="id"
        pagination={20}
      />
      <Modal
        title="Edit Test"
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            name="test_name"
            label="Name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="subject"
            label="Subject"
            rules={[{ required: true, message: "Please select a subject" }]}
          >
            <Select placeholder="Select Subject" disabled={isLevelTest}>
              {subjects.map((subject) => (
                <Select.Option key={subject.id} value={subject.id}>
                  {subject.subject_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="month"
            label="Month"
            rules={[{ required: true, message: "Please select a month" }]}
          >
            <Select placeholder="Select Month">
              {months.map((month) => (
                <Select.Option key={month.id} value={month.id}>
                  {month.month_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="total_marks"
            label="Total Mark"
            rules={[{ required: true, message: "Please enter total mark" }]}
            help="Total marks cannot be modified"
          >
            <Input readOnly />
          </Form.Item>

          <Form.Item
            name="about_test"
            label="About Test"
            rules={[{ required: true, message: "Please enter test details" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="created_at"
            label="Date"
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <DatePicker format="DD/MMM/YY" style={{ width: "100%" }} />
          </Form.Item>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <FwButton color="secondary" onFwClick={() => setIsModalOpen(false)}>
              Cancel
            </FwButton>
            <FwButton color="primary" onFwClick={() => form.submit()}>
              Confirm
            </FwButton>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default TestDetailsTable;
