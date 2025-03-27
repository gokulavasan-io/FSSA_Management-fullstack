import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Popconfirm } from "antd";
import {
  getSubjects,
  addSubject,
  updateSubject,
  deleteSubject,
} from "../../../../api/adminAPI";
import { FwButton } from "@freshworks/crayons/react";
import { useMainContext } from "../../../../Context/MainContext";

const SubjectTable = () => {
  const {requiredSubjects,setSubjects} = useMainContext()
  const [adminSubjects, setAdminSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [helperText, setHelperText] = useState("")
  const [form] = Form.useForm();

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      let data = await getSubjects();
      setSubjects(data)
      data = data.filter(
        (subject) =>
          subject.subject_name != "Attendance" &&
          subject.subject_name != "Behavior"
      );
      setAdminSubjects(data);
    } catch (error) {
      console.error("error fetching subject : ", error);
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setEditingSubject(null);
    form.resetFields();
    setModalVisible(true);
    setHelperText("")
  };
  
  const handleDelete = async (id) => {
    try {
      await deleteSubject(id);
      fetchSubjects();
    } catch (error) {
      console.error("error deleting subject : ", error);
    }
  };

  const handleSubmit = async (values) => {
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
      setHelperText(error.response.data?.subject_name[0])
    }
  };

  const columns = [
    { title: "Subject Name", dataIndex: "subject_name", key: "subject_name" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {

        if (requiredSubjects.has(record.subject_name)) {
          return <p
          style={{color:"#566573"}}
        >
          Sorry! You cannot edit / delete this Subject
        </p>
        }

        return (
          <>
            <Button
              type="link"
              onClick={() => {
                setEditingSubject(record);
                form.setFieldsValue(record);
                setModalVisible(true);
                setHelperText("")

              }}
            >
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
        );
      },
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
        dataSource={adminSubjects}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingSubject ? "Edit Subject" : "Add Subject"}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="subject_name"
            label="Subject Name"
            rules={[{ required: true, message: "Please enter a subject name" }]}
            help={helperText}
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
