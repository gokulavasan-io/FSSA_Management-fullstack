import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
} from "antd";
import {
  addStudent,
  deleteStudent,
  getChoices,
  getStudents,
  updateStudent,
} from "../../../../api/adminAPI";
import { FwButton } from "@freshworks/crayons/react";


const { Option } = Select;

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [choices, setChoices] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [form] = Form.useForm();

  const fetchStudents = async () => {
    let res = await getStudents();
    setStudents(res);
  };

  const fetchChoices = async () => {
    let res = await getChoices();
    setChoices(res);
  };

  useEffect(() => {
    fetchStudents();
    fetchChoices();
  }, []);

  const handleSubmit = async (values) => {
    try {
      if(editingStudent){
      await updateStudent(editingStudent.id, values)
    }
    else{
      console.log(values);
      await addStudent({...values,batch:4}); // for temporary -> batch 4
    }
    setIsModalOpen(false);
    fetchStudents();
    form.resetFields();
    } catch (error) {
      console.error("Failed to add/edit student : ",error)
    }
  };

  const handleDelete =async (id) => {
    await deleteStudent(id)
    fetchStudents();
  };

  const openModal = (record = null) => {
    setEditingStudent(record);
    form.setFieldsValue(record || {});
    setIsModalOpen(true);
  };

  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Mail ID", dataIndex: "mailID" },
    { title: "Batch", dataIndex: "batch" },
    { title: "Age", dataIndex: "age" },
    { title: "Gender", dataIndex: "gender" },
    { title: "Category", dataIndex: "category" },
    { title: "Medium", dataIndex: "medium" },
    { title: "School", dataIndex: "school" },
    {
      title: "Actions",
      render: (_, record) => (
        <>
          <Button onClick={() => openModal(record)} type="link">
            Edit
          </Button>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.id)}
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
      <div style={{ marginBottom: 10,display:"flex",justifyContent:"flex-end"}}><FwButton
        color="primary"
        onFwClick={() => openModal()}
        
      >
        Add Student
      </FwButton>
      </div>
      <Table columns={columns} dataSource={students} rowKey="id" pagination={{
          pageSize: 10, 
          showQuickJumper: true,  
        }} />

      <Modal
        title={editingStudent ? "Edit Student" : "Add Student"}
        visible={isModalOpen}
        footer={null}
        zIndex={10000000}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} onFinish={handleSubmit} >
          <Form.Item name="name" label="Name" rules={[{ required: true,min:3,max:25,message:"Username must be between 3-25 characters" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="age"
            label="Age"
            rules={[
              { required: true, message: "Age is required!" },
              () => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.reject("Age is required!");
                  }
                  if (value >= 17 && value <= 22) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Age must be between 17 to 22");
                },
              }),
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
            <Select>
              {choices.genders?.map((opt) => (
                <Option key={opt.value}>{opt.label}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true }]}
          >
            <Select>
              {choices.categories?.map((opt) => (
                <Option key={opt.value}>{opt.label}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="medium" label="Medium" rules={[{ required: true }]}>
            <Select>
              {choices.mediums?.map((opt) => (
                <Option key={opt.value}>{opt.label}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="school" label="School" rules={[{ required: true }]}>
            <Select>
              {choices.schools?.map((opt) => (
                <Option key={opt.value}>{opt.label}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="mailID" label="Email" rules={[{ type: "email", message: "Invalid email format" }]}>
            <Input type="email" />
          </Form.Item>
          <div style={{display:"flex",justifyContent:"flex-end",gap:10}} >
            <FwButton color="secondary" onFwClick={() => setIsModalOpen(false)} >Cancel</FwButton>
            <FwButton color="primary" onFwClick={() => form.submit()} >Confirm</FwButton>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default StudentTable;
