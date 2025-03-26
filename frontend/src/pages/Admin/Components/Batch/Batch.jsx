import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, InputNumber, Popconfirm } from 'antd';
import { addBatch, deleteBatch, getBatches, updateBatch } from '../../../../api/adminAPI';
import { FwButton } from "@freshworks/crayons/react";

const BatchTable = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [errorText, setErrorText] = useState("");
  const [form] = Form.useForm();


  const fetchBatches = async () => {
    setLoading(true);
    try {
      let res=await getBatches()
      setBatches(res);
    } catch (error) {
      console.error('Failed to fetch batches',error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const showAddModal = () => {
    setEditingBatch(null);
    form.resetFields();
    setIsModalVisible(true);
    setErrorText("")
  };

  const showEditModal = (record) => {
    setEditingBatch(record);
    form.setFieldsValue({ batch_no: record.batch_no });
    setIsModalVisible(true);
    setErrorText("")

  };

  const handleSubmit = async (values) => {
    try {
      if (editingBatch) {
        await updateBatch(editingBatch.id,values)
      } else {
        await addBatch(values)
      }
      fetchBatches();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Failed to save batch',error);
      setErrorText(error.response.data?.batch_no[0])
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBatch(id)
      fetchBatches();
    } catch (error) {
      console.error('Failed to delete batch',error);
    }
  };

  const columns = [
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
    <>
      <div  style={{ marginBottom: 10,display:"flex",justifyContent:"flex-end"}} >
          <FwButton type="primary" onFwClick={showAddModal}>Add Batch</FwButton>
      </div>
      <Table
        dataSource={batches}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
      
      <Modal
        title={editingBatch ? 'Edit Batch' : 'Add Batch'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} >
          <Form.Item
            name="batch_no"
            label="Batch No"
            rules={[{ required: true, message: 'Please enter batch number' }]}
            help={errorText}
          >
            <InputNumber placeholder="Enter batch number" style={{ width: '100%' }} />
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

export default BatchTable;
