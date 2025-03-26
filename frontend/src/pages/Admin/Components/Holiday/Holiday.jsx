import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, DatePicker, message, Popconfirm } from "antd";
import dayjs from "dayjs";
import AddHoliday from "./NewHoliday";
import { deleteHoliday, getHolidays, updateHoliday } from "../../../../api/adminAPI";

const HolidayTable = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingHolidayId, setEditingHolidayId] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    setLoading(true);
    try {
      const response = await getHolidays()
      setHolidays(response);
    } catch (error) {
      message.error("Failed to fetch holidays");
    }
    setLoading(false);
  };

  const handleEdit = (record) => {
    setIsEditing(true);
    setEditingHolidayId(record.id);
    form.setFieldsValue({
      date: dayjs(record.date),
      reason: record.reason,
    });
    setIsModalOpen(true);
  };
  

  const handleDelete = async (id) => {
    try {
      await deleteHoliday(id)
      message.success("Holiday deleted");
      fetchHolidays();
    } catch (error) {
      message.error("Failed to delete holiday");
    }
  };
  const handleSave = async (values) => {
    const data = {
      date: values.date.format("YYYY-MM-DD"),
      reason: values.reason,
    };
    try {
      await updateHoliday(editingHolidayId, data); 
      message.success("Holiday updated");
      fetchHolidays();
      setIsModalOpen(false);
      setIsEditing(false);
      setEditingHolidayId(null);
    } catch (error) {
      message.error("Failed to update holiday");
    }
  };
  

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this holiday?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <AddHoliday  reFetchFunction={fetchHolidays} />
      <Table columns={columns} dataSource={holidays} loading={loading} rowKey="id" />
      
      <Modal
        title="Edit Holiday"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setIsEditing(false);
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleSave} layout="vertical">
          <Form.Item name="date" label="Date"  help="Date cannot be modified." >
            <DatePicker 
              format="YYYY-MM-DD" 
              style={{ width: "100%" }} 
              disabled={isEditing}
            />
          </Form.Item>

          <Form.Item name="reason" label="Reason" rules={[{ required: true, message: "Reason is required" }]}> 
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default HolidayTable;
