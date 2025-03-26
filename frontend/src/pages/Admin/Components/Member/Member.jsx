import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Checkbox, Popconfirm } from 'antd';
import { addMember, deleteMember, getMembers, getRoles, updateMember } from '../../../../api/adminAPI';
import { fetchSections } from '../../../../api/generalAPI';
import { FwButton } from "@freshworks/crayons/react";

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
      getMembers(),
      getRoles(),
      fetchSections()
    ]);
    setMembers(membersData);
    setRoles(rolesData);
    setSections(sectionsData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddOrEdit = async (values) => {
    try {
      if (editingMember) {
        await updateMember(editingMember.id,values)
      } else {
        await addMember(values)
      }
      setIsModalOpen(false);
      fetchData();
      form.resetFields();
      
    } catch (error) {
      console.error("Error adding/updating error : ",error);
      
    }
  };

  const handleDelete = async (id) => {
    await deleteMember(id)
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
          <Button type='link' onClick={() => { setEditingMember(record); form.setFieldsValue(record); setIsModalOpen(true); }}>Edit</Button>
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
            <Button type='link' danger>Delete</Button>
          </Popconfirm>
        </>
      )
    }
  ];

  return (
    <>
      <div  style={{ marginBottom: 10,display:"flex",justifyContent:"flex-end"}} >
      <FwButton type="primary" onClick={() => { setEditingMember(null); form.resetFields(); setIsModalOpen(true); }}>Add Member</FwButton>
      </div>

      <Table dataSource={members} columns={columns} rowKey="id" />

      <Modal visible={isModalOpen} onCancel={() => setIsModalOpen(false)}  footer={null} title={editingMember ? 'Edit Member' : 'Add Member'}>
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
          <div style={{display:"flex",justifyContent:"flex-end",gap:10}} >
            <FwButton color="secondary" onFwClick={() => setIsModalOpen(false)} >Cancel</FwButton>
            <FwButton color="primary" onFwClick={() => form.submit()} >Confirm</FwButton>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default MemberTable;
