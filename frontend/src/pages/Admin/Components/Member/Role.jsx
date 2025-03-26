import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm } from 'antd';
import { addRole, deleteRole, getRoles, updateRole } from '../../../../api/adminAPI';

const RoleTable = () => {
  const [roles, setRoles] = useState([]);
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const fetchRoles = async () => {
    const response = await getRoles()
    setRoles(response);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleAddOrEdit = async (values) => {
    if (editingRole) {
      await updateRole(editingRole.id,values)
      message.success('Role updated');
    } else {
      await addRole(values)
      message.success('Role added');
    }
    setIsModalOpen(false);
    fetchRoles();
    form.resetFields();
  };

  const handleDelete = async (id) => {
    await deleteRole(id)
    message.success('Role deleted');
    fetchRoles();
  };

  const columns = [
    { title: 'Name', dataIndex: 'name' },
    {
      title: 'Actions',
      render: (_, record) => (
        <>
          <Button onClick={() => { setEditingRole(record); form.setFieldsValue(record); setIsModalOpen(true); }}>Edit</Button>
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
            <Button danger>Delete</Button>
          </Popconfirm>
        </>
      )
    }
  ];

  return (
    <>
      <Button type="primary" onClick={() => { setEditingRole(null); form.resetFields(); setIsModalOpen(true); }}>Add Role</Button>
      <Table dataSource={roles} columns={columns} rowKey="id" />

      <Modal visible={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={() => form.submit()} title={editingRole ? 'Edit Role' : 'Add Role'}>
        <Form form={form} onFinish={handleAddOrEdit}>
          <Form.Item name="name" label="Role Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default RoleTable;
