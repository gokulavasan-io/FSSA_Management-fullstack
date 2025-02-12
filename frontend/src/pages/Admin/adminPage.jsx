import { useState, useEffect } from "react";
import axios from "axios";
import { useFormik } from "formik";
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
  const [open, setOpen] = useState(false); // Dialog state

  useEffect(() => {
    fetchMembers();
    fetchRoles();
    fetchSections();
  }, []);

  // Fetch members
  const fetchMembers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/member/members/");
      setMembers(response.data);
    } catch (error) {
      message.error("Failed to fetch members");
    }
  };

  // Fetch roles
  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/member/roles/");
      setRoles(response.data);
    } catch (error) {
      message.error("Failed to fetch roles");
    }
  };

  // Fetch sections
  const fetchSections = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/students/sections/");
      setSections(response.data);
    } catch (error) {
      message.error("Failed to fetch sections");
    }
  };

  // Form validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required").min(3, "Name must be at least 3 characters"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    role: Yup.string().required("Role is required"),
    section: Yup.string().required("Section is required"),
    is_admin: Yup.boolean(),
  });

  // Formik for form handling
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      role: "",
      section: "",
      is_admin: false,
    },
    validationSchema,
    onSubmit: async (values, { resetForm, setErrors }) => {
      try {
        if (editingId) {
          await axios.put(`http://127.0.0.1:8000/member/update_member/${editingId}/`, values);
          message.success("Member updated successfully!");
          setEditingId(null);
        } else {
          await axios.post("http://127.0.0.1:8000/member/add_member/", values);
          message.success("Member added successfully!");
        }
        fetchMembers();
        resetForm();
        handleClose();
      } catch (error) {
        if (error.response && error.response.data) {
          setErrors(error.response.data); 
        } else {
          message.error("Failed to save member");
        }
      }
    }
    
  });

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/member/delete_member/${id}/`);
      message.success("Member deleted successfully!");
      fetchMembers();
    } catch (error) {
      message.error("Failed to delete member");
    }
  };

  // Open popup for editing
  const handleEdit = (member) => {
    setEditingId(member.id);
    formik.setValues({
      name: member.name,
      email: member.email,
      role: member.role,
      section: member.section,
      is_admin: member.is_admin,
    });
    setOpen(true);
  };

  // Open popup for adding
  const handleOpen = () => {
    setEditingId(null);
    formik.resetForm();
    setOpen(true);
  };

  // Close popup
  const handleClose = () => {
    setOpen(false);
  };

  // Table columns
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

      {/* Popup Dialog for Adding/Editing */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? "Edit Member" : "Add Member"}</DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit} className="p-4">
            <Stack spacing={2}>
              <TextField
                label="Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                fullWidth
                required
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />

              <TextField
                label="Email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                fullWidth
                required
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />

              <TextField
                select
                label="Role"
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                fullWidth
                required
                error={formik.touched.role && Boolean(formik.errors.role)}
                helperText={formik.touched.role && formik.errors.role}
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Section"
                name="section"
                value={formik.values.section}
                onChange={formik.handleChange}
                fullWidth
                required
                error={formik.touched.section && Boolean(formik.errors.section)}
                helperText={formik.touched.section && formik.errors.section}
              >
                {sections.map((section) => (
                  <MenuItem key={section.id} value={section.id}>
                    {section.name}
                  </MenuItem>
                ))}
              </TextField>

              <FormControlLabel
                control={<Checkbox name="is_admin" checked={formik.values.is_admin} onChange={formik.handleChange} />}
                label="Is Admin?"
              />
            </Stack>
          </form>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={formik.handleSubmit} variant="contained" color="primary">
            {editingId ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default AdminPage;
