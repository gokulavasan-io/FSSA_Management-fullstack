import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Popconfirm, } from 'antd';
import { addSection, deleteSection, getSections, updateSection } from '../../../../api/adminAPI';
import { FwButton } from "@freshworks/crayons/react";

const SectionTable = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [errorText, setErrorText] = useState("");
  const [form] = Form.useForm();


  const fetchSections = async () => {
    setLoading(true);
    try {
      const response = await getSections()
      setSections(response);
    } catch (error) {
      console.error('Failed to fetch sections',error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const showAddModal = () => {
    setEditingSection(null);
    form.resetFields();
    setIsModalVisible(true);
    setErrorText("")
  };

  const showEditModal = (record) => {
    setEditingSection(record);
    form.setFieldsValue({ name: record.name });
    setIsModalVisible(true);
    setErrorText("")

  };

  const handleSubmit = async (values) => {
    try {
      values={...values,name:values?.name.toUpperCase()}
      if (editingSection) {
        await updateSection(editingSection.id,values)
        alert('Section updated successfully');
      } else {
        await addSection(values)
        alert('Section created successfully');
      }
      fetchSections();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Failed to save section',error);
      setErrorText(error.response.data?.name[0])

    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSection(id)
      alert('Section deleted successfully');
      fetchSections();
    } catch (error) {
      console.error('Failed to delete section',error);
    }
  };

  const columns = [
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
    <>
      <div  style={{ marginBottom: 10,display:"flex",justifyContent:"flex-end"}} >
                <FwButton type="primary" onFwClick={showAddModal}>Add Section</FwButton>
            </div>
      <Table
        dataSource={sections}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
      
      <Modal
        title={editingSection ? 'Edit Section' : 'Add Section'}
        open={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} >
          <Form.Item
            name="name"
            label="Section Name"
            rules={[{ required: true,min:1,max:1, message: 'Please enter valid section name' }]}
            help={errorText}
          >
            <Input placeholder="Enter section name" />
          </Form.Item>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                      <FwButton color="secondary" onFwClick={() => setIsModalVisible(false)}>
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

export default SectionTable;
