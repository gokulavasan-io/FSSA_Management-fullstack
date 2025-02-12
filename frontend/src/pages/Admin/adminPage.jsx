import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Button,
  Paper,
  Typography,
  Dialog,
  Stack,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { Table, Space, Popconfirm, message } from "antd";
import { Edit, Delete, Add } from "@mui/icons-material";

const AdminPage = () => {
  const [members, setMembers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [sections, setSections] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchMembers();
    fetchRoles();
    fetchSections();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/member/members/");
      setMembers(response.data);
    } catch (error) {
      message.error("Failed to fetch members");
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/member/roles/");
      setRoles(response.data);
    } catch (error) {
      message.error("Failed to fetch roles");
    }
  };

  const fetchSections = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/students/sections/");
      setSections(response.data);
    } catch (error) {
      message.error("Failed to fetch sections");
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required").min(3, "Must be at least 3 characters"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    role: Yup.string().required("Role is required"),
    section: Yup.string().required("Section is required"),
    is_admin: Yup.boolean(),
  });

  const { register, handleSubmit, reset, setValue,setError, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await axios.put(`http://127.0.0.1:8000/member/update_member/${editingId}/`, data);
        message.success("Member updated successfully!");
        setEditingId(null);
      } else {
        await axios.post("http://127.0.0.1:8000/member/add_member/", data);
        message.success("Member added successfully!");
      }
      fetchMembers();
      reset();
      handleClose();
    } catch (error) {
      if (error.response && error.response.data) {
        const apiErrors = error.response.data;
        
        Object.keys(apiErrors).forEach((field) => {
          setError(field, {
            type: "server",
            message: apiErrors[field][0], 
          });
        });
  
        message.error("Failed to save member. Please check the form for errors.");
      } else {
        message.error("An unexpected error occurred.");
      }
    }
  };
  

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/member/delete_member/${id}/`);
      message.success("Member deleted successfully!");
      fetchMembers();
    } catch (error) {
      message.error("Failed to delete member");
    }
  };

  const handleEdit = (member) => {
    setEditingId(member.id);
    setValue("name", member.name);
    setValue("email", member.email);
    setValue("role", member.role);
    setValue("section", member.section);
    setValue("is_admin", member.is_admin);
    setOpen(true);
  };

  const handleOpen = () => {
    setEditingId(null);
    reset();
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Role", dataIndex: "role", key: "role" },
    { title: "Section", dataIndex: "section", key: "section" },
    {
      title: "Admin",
      dataIndex: "is_admin",
      key: "is_admin",
      render: (isAdmin) => (isAdmin ? "Yes" : "No"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <IconButton color="primary" onClick={() => handleEdit(record)}>
            <Edit />
          </IconButton>
          <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(record.id)}>
            <IconButton color="error">
              <Delete />
            </IconButton>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Paper className="p-6 mx-auto mt-10 max-w-4xl shadow-lg">
      <Typography variant="h5" align="center" gutterBottom>
        Admin - Manage Members
      </Typography>

      <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleOpen} sx={{ marginBottom: 2 }}>
        Add Member
      </Button>

      <Table dataSource={members} columns={columns} rowKey="id" pagination={{ pageSize: 5 }} />

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? "Edit Member" : "Add Member"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <TextField label="Name" {...register("name")} error={!!errors.name} helperText={errors.name?.message} fullWidth required />
              <TextField label="Email" {...register("email")} error={!!errors.email} helperText={errors.email?.message} fullWidth required />
              <TextField select label="Role" {...register("role")} error={!!errors.role} helperText={errors.role?.message} fullWidth required defaultValue={""}>
                {roles.map((role) => <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>)}
              </TextField>
              <TextField select label="Section" {...register("section")} error={!!errors.section} helperText={errors.section?.message} fullWidth required defaultValue={""}>
                {sections.map((section) => <MenuItem key={section.id} value={section.id}>{section.name}</MenuItem>)}
              </TextField>
              <FormControlLabel control={<Checkbox {...register("is_admin")} />} label="Is Admin?" />
            </Stack>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button type="submit" variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>{editingId ? "Update" : "Add"}</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default AdminPage;
