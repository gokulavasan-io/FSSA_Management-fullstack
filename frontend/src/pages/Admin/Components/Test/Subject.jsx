import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message, Popconfirm } from "antd";
import { getSubjects, addSubject, updateSubject, deleteSubject } from "../../../../api/adminAPI";

const SubjectTable = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      let data = await getSubjects();
      data=data.filter(subject=>subject.subject_name!="Attendance"&&subject.subject_name!="Behavior")
      setSubjects(data);
    } catch (error) {
      message.error("Failed to fetch subjects");
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setEditingSubject(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    form.setFieldsValue(subject);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteSubject(id);
      message.success("Subject deleted successfully");
      fetchSubjects();
    } catch (error) {
      message.error("Failed to delete subject");
    }
  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingSubject) {
        await updateSubject(editingSubject.id, values);
        message.success("Subject updated successfully");
      } else {
        await addSubject(values);
        message.success("Subject added successfully");
      }
      setModalVisible(false);
      fetchSubjects();
    } catch (error) {
      message.error("Failed to save subject");
    }
  };

  const columns = [
    { title: "Subject Name", dataIndex: "subject_name", key: "subject_name" },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>Add Subject</Button>
      <Table columns={columns} dataSource={subjects} rowKey="id" loading={loading} />

      <Modal
        title={editingSubject ? "Edit Subject" : "Add Subject"}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleFormSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="subject_name"
            label="Subject Name"
            rules={[{ required: true, message: "Please enter a subject name" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SubjectTable;
