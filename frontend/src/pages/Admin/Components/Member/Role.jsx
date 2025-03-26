import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Popconfirm } from "antd";
import {
  addRole,
  deleteRole,
  getRoles,
  updateRole,
} from "../../../../api/adminAPI";
import { FwButton } from "@freshworks/crayons/react";

const RoleTable = () => {
  const [roles, setRoles] = useState([]);
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const fetchRoles = async () => {
    const response = await getRoles();
    setRoles(response);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleAddOrEdit = async (values) => {
    try {
      if (editingRole) {
        await updateRole(editingRole.id, values);
      } else {
        await addRole(values);
      }
      setIsModalOpen(false);
      fetchRoles();
      form.resetFields();
    } catch (error) {
        console.error( "error adding/updating role : ", error);
    }
  };

  const handleDelete = async (id) => {
    await deleteRole(id);
    fetchRoles();
  };

  const columns = [
    { title: "Name", dataIndex: "name" },
    {
      title: "Actions",
      render: (_, record) => (
        <>
          <Button
          type="link"
            onClick={() => {
              setEditingRole(record);
              form.setFieldsValue(record);
              setIsModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger>Delete</Button>
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
        <FwButton
          type="primary"
          onClick={() => {
            setEditingRole(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
        >
          Add Role
        </FwButton>
      </div>
      <Table dataSource={roles} columns={columns}  rowKey="id" />

      <Modal
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        title={editingRole ? "Edit Role" : "Add Role"}
      >
        <Form form={form} onFinish={handleAddOrEdit}>
          <Form.Item name="name" label="Role Name" rules={[{ required: true }]}>
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
    </>
  );
};

export default RoleTable;
