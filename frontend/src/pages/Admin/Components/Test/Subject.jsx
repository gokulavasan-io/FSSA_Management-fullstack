import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Popconfirm } from "antd";
import {
  getSubjects,
  addSubject,
  updateSubject,
  deleteSubject,
} from "../../../../api/adminAPI";
import { FwButton } from "@freshworks/crayons/react";

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
      data = data.filter(
        (subject) =>
          subject.subject_name != "Attendance" &&
          subject.subject_name != "Behavior"
      );
      setSubjects(data);
    } catch (error) {
      console.error("error fetching subject : ", error);
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setEditingSubject(null);
    form.resetFields();
    setModalVisible(true);
  };


  const handleDelete = async (id) => {
    try {
      await deleteSubject(id);
      fetchSubjects();
    } catch (error) {
      console.error("error deleting subject : ", error);
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingSubject) {
        await updateSubject(editingSubject.id, values);
      } else {
        await addSubject(values);
      }
      setModalVisible(false);
      fetchSubjects();
    } catch (error) {
      console.error("error adding/updating subject : ", error);
    }
  };

  const columns = [
    { title: "Subject Name", dataIndex: "subject_name", key: "subject_name" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => {
            setEditingSubject(record);
            form.setFieldsValue(record);
            setModalVisible(true);
          }}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure?"
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
    <div>
      <div
        style={{
          marginBottom: 10,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <FwButton type="primary" onClick={handleAdd}>
          Add Subject
        </FwButton>
      </div>
      <Table
        columns={columns}
        dataSource={subjects}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingSubject ? "Edit Subject" : "Add Subject"}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="subject_name"
            label="Subject Name"
            rules={[{ required: true, message: "Please enter a subject name" }]}
          >
            <Input />
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
    </div>
  );
};

export default SubjectTable;
