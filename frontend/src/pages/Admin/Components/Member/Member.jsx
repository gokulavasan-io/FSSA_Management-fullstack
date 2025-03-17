import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Checkbox, message, Popconfirm } from 'antd';
import axios from 'axios';

const { Option } = Select;

const MemberTable = () => {
  const [members, setMembers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [sections, setSections] = useState([]);
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const fetchData = async () => {
    const [membersData, rolesData, sectionsData] = await Promise.all([
      axios.get('http://127.0.0.1:8000/member/members/'),
      axios.get('http://127.0.0.1:8000/member/roles/'),
      axios.get('http://127.0.0.1:8000/students/sections/')
    ]);
    setMembers(membersData.data);
    setRoles(rolesData.data);
    setSections(sectionsData.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddOrEdit = async (values) => {
    if (editingMember) {
      await axios.put(`http://127.0.0.1:8000/member/members/${editingMember.id}/`, values);
      message.success('Member updated');
    } else {
      await axios.post('http://127.0.0.1:8000/member/members/', values);
      message.success('Member added');
    }
    setIsModalOpen(false);
    fetchData();
    form.resetFields();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/member/members/${id}/`);
    message.success('Member deleted');
    fetchData();
  };

  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Role', dataIndex: 'role_name' },
    { title: 'Section', dataIndex: 'section_name' },
    { title: 'Admin', dataIndex: 'is_admin', render: (val) => (val ? 'Yes' : 'No') },
    {
      title: 'Actions',
      render: (_, record) => (
        <>
          <Button onClick={() => { setEditingMember(record); form.setFieldsValue(record); setIsModalOpen(true); }}>Edit</Button>
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
            <Button danger>Delete</Button>
          </Popconfirm>
        </>
      )
    }
  ];

  return (
    <>
      <Button type="primary" onClick={() => { setEditingMember(null); form.resetFields(); setIsModalOpen(true); }}>Add Member</Button>
      <Table dataSource={members} columns={columns} rowKey="id" />

      <Modal visible={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={() => form.submit()} title={editingMember ? 'Edit Member' : 'Add Member'}>
        <Form form={form} onFinish={handleAddOrEdit} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select>{roles.map(role => <Option key={role.id} value={role.id}>{role.name}</Option>)}</Select>
          </Form.Item>
          <Form.Item name="section" label="Section" rules={[{ required: true }]}>
            <Select>{sections.map(sec => <Option key={sec.id} value={sec.id}>{sec.name}</Option>)}</Select>
          </Form.Item>
          <Form.Item name="is_admin" valuePropName="checked"><Checkbox>Is Admin?</Checkbox></Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default MemberTable;
