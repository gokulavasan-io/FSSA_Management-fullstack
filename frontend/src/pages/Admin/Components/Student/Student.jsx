import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm } from 'antd';
import axios from 'axios';

const { Option } = Select;

const StudentTable = () => {
    const [students, setStudents] = useState([]);
    const [choices, setChoices] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [form] = Form.useForm();

    const fetchStudents = () => {
        axios.get('http://localhost:8000/students/students/').then(res => {
          setStudents(res.data)
          console.log(res.data);
          
        });
    };

    const fetchChoices = () => {
        axios.get('http://localhost:8000/students/choices/').then(res => setChoices(res.data));
    };

    useEffect(() => {
        fetchStudents();
        fetchChoices();
    }, []);

    const handleSubmit = (values) => {
        const apiCall = editingStudent
            ? axios.put(`http://localhost:8000/students/students/${editingStudent.id}/`, values)
            : axios.post('http://localhost:8000/students/students/', values);
        apiCall.then(() => {
            message.success('Saved successfully');
            setIsModalOpen(false);
            fetchStudents();
            form.resetFields();
        });
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:8000/students/students/${id}/`).then(() => {
            message.success('Deleted successfully');
            fetchStudents();
        });
    };

    const openModal = (record = null) => {
        setEditingStudent(record);
        form.setFieldsValue(record || {});
        setIsModalOpen(true);
    };

    const columns = [
      { title: 'Name', dataIndex: 'name' },
      { title: 'Mail ID', dataIndex: 'mailID' },
      { title: 'Batch', dataIndex: 'batch' },
        { title: 'Age', dataIndex: 'age' },
        { title: 'Gender', dataIndex: 'gender' },
        { title: 'Category', dataIndex: 'category' },
        { title: 'Medium', dataIndex: 'medium' },
        { title: 'School', dataIndex: 'school' },
        {
            title: 'Actions',
            render: (_, record) => (
                <>
                    <Button onClick={() => openModal(record)} type="link">Edit</Button>
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
                        <Button type="link" danger>Delete</Button>
                    </Popconfirm>
                </>
            )
        }
    ];

    return (
        <>
            <Button type="primary" onClick={() => openModal()} style={{ marginBottom: 16 }}>
                Add Student
            </Button>
            <Table columns={columns} dataSource={students} rowKey="id" />

            <Modal title={editingStudent ? 'Edit Student' : 'Add Student'} visible={isModalOpen}
                onCancel={() => setIsModalOpen(false)} onOk={() => form.submit()}>
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="age" label="Age"   rules={[{ required: true }]}  >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="gender" label="Gender"  rules={[{ required: true }]} >
                        <Select>{choices.genders?.map(opt => <Option key={opt.value}>{opt.label}</Option>)}</Select>
                    </Form.Item>
                    <Form.Item name="category" label="Category"  rules={[{ required: true }]} >
                        <Select>{choices.categories?.map(opt => <Option key={opt.value}>{opt.label}</Option>)}</Select>
                    </Form.Item>
                    <Form.Item name="medium" label="Medium"  rules={[{ required: true }]} >
                        <Select>{choices.mediums?.map(opt => <Option key={opt.value}>{opt.label}</Option>)}</Select>
                    </Form.Item>
                    <Form.Item name="school" label="School"  rules={[{ required: true }]} >
                        <Select>{choices.schools?.map(opt => <Option key={opt.value}>{opt.label}</Option>)}</Select>
                    </Form.Item>
                    <Form.Item name="mailID" label="Email"  rules={[{ required: true }]} >
                        <Input type="email" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default StudentTable;
