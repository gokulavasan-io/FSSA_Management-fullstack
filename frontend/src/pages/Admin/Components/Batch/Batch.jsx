import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, InputNumber, Popconfirm, message } from 'antd';
import axios from 'axios';
import { addBatches, deleteBatches, getBatches, updateBatches } from '../../../../api/adminAPI';

const BatchTable = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [form] = Form.useForm();


  const fetchBatches = async () => {
    setLoading(true);
    try {
      let res=await getBatches()
      setBatches(res);
    } catch (error) {
      message.error('Failed to fetch batches');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  // ✅ Add Modal
  const showAddModal = () => {
    setEditingBatch(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // ✅ Edit Modal
  const showEditModal = (record) => {
    setEditingBatch(record);
    form.setFieldsValue({ batch_no: record.batch_no });
    setIsModalVisible(true);
  };

  // ✅ Form Submit (Add / Edit)
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingBatch) {
        await updateBatches(editingBatch.id,values)
        message.success('Batch updated successfully');
      } else {
        await addBatches(values)
        message.success('Batch created successfully');
      }
      fetchBatches();
      setIsModalVisible(false);
    } catch (error) {
      message.error('Failed to save batch');
    }
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    try {
      await deleteBatches(id)
      message.success('Batch deleted successfully');
      fetchBatches();
    } catch (error) {
      message.error('Failed to delete batch');
    }
  };

  // ✅ Table Columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Batch No',
      dataIndex: 'batch_no',
      key: 'batch_no',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button onClick={() => showEditModal(record)} type="link">Edit</Button>
          <Popconfirm
            title="Are you sure to delete this batch?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={showAddModal} style={{ marginBottom: 16 }}>
        Add Batch
      </Button>
      <Table
        dataSource={batches}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
      
      {/* Modal for Add/Edit */}
      <Modal
        title={editingBatch ? 'Edit Batch' : 'Add Batch'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="batch_no"
            label="Batch No"
            rules={[{ required: true, message: 'Please enter batch number' }]}
          >
            <InputNumber placeholder="Enter batch number" style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BatchTable;
