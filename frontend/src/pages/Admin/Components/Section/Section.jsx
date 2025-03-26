import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Popconfirm, message } from 'antd';
import { addSection, deleteSection, getSections, updateSection } from '../../../../api/adminAPI';

const SectionTable = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [form] = Form.useForm();


  // ✅ Fetch sections
  const fetchSections = async () => {
    setLoading(true);
    try {
      const response = await getSections()
      setSections(response);
    } catch (error) {
      message.error('Failed to fetch sections');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSections();
  }, []);

  // ✅ Handle Add Section button
  const showAddModal = () => {
    setEditingSection(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // ✅ Handle Edit Section button
  const showEditModal = (record) => {
    setEditingSection(record);
    form.setFieldsValue({ name: record.name });
    setIsModalVisible(true);
  };

  // ✅ Handle form submission for Add/Edit
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingSection) {
        // Update existing
        await updateSection(editingSection.id,values)
        message.success('Section updated successfully');
      } else {
        // Create new
        await addSection(values)
        message.success('Section created successfully');
      }
      fetchSections();
      setIsModalVisible(false);
    } catch (error) {
      message.error('Failed to save section');
    }
  };

  // ✅ Handle delete section
  const handleDelete = async (id) => {
    try {
      await deleteSection(id)
      message.success('Section deleted successfully');
      fetchSections();
    } catch (error) {
      message.error('Failed to delete section');
    }
  };

  // ✅ Columns for Antd Table
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Section Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button onClick={() => showEditModal(record)} type="link">
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this section?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
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
      <Button type="primary" onClick={showAddModal} style={{ marginBottom: 16 }}>
        Add Section
      </Button>
      <Table
        dataSource={sections}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
      
      {/* Modal for Add/Edit Form */}
      <Modal
        title={editingSection ? 'Edit Section' : 'Add Section'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Section Name"
            rules={[{ required: true, message: 'Please enter section name' }]}
          >
            <Input placeholder="Enter section name" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SectionTable;
