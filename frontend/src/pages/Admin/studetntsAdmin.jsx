import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  TextField,
  MenuItem,
  Button,
  Paper,
  Typography,
  Dialog,
  Stack,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { message } from "antd";

const validationSchema = Yup.object().shape({
  name: Yup.string()
  .matches(/^(?=.*[a-zA-Z])[a-zA-Z0-9\s]*$/, "Enter a valid name")
  .min(3, "Enter a valid name")
  .required("Enter a valid name"), 
  section: Yup.string().required("Section is required"),
  age: Yup.number().typeError("Enter valid age").required("Age is required").min(16, "Minimum age is 16").max(25, "Maximum age is 25"),
  gender: Yup.string().required("Gender is required"),
  category: Yup.string().required("Category is required"),
  medium: Yup.string().required("Medium is required"),
  school: Yup.string().required("School is required"),
  batch: Yup.string().required("Batch is required"),
});

const AddStudent = () => {
  const [choices, setChoices] = useState({
    categories: [],
    mediums: [],
    schools: [],
    batches: [],
    genders:[],
    sections:[],
  });
  const [open, setOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      section: "",
      age: "",
      gender: "",
      category: "",
      medium: "",
      school: "",
      batch: "",
    },
  });

  useEffect(() => {
    axios.get("http://localhost:8000/students/choices/")
      .then((res) => setChoices(res.data))
      .catch((err) => console.error("Failed to fetch choices", err));

  }, []);

  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:8000/students/studentsData/", data);
      message.success("Student added successfully!");
      reset();
      setOpen(false);
    } catch (error) {
      message.error("Failed to add student");
    }
  };

  return (
    <Paper className="p-6 mx-auto mt-10 max-w-4xl shadow-lg">
      <Typography variant="h5" align="center" gutterBottom>
        Admin - Upload Student
      </Typography>
      <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
        Add Student
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Student</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)} className="p-4">
            <Stack spacing={2}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Name" fullWidth error={!!errors.name} helperText={errors.name?.message} />
                )}
              />
              <Controller
                name="section"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Section" fullWidth error={!!errors.section} helperText={errors.section?.message}>
                    {choices.sections.map((section) => (
                      <MenuItem key={section.id} value={section.id}>{section.name}</MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Controller
                name="age"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Age" type="number" fullWidth error={!!errors.age} helperText={errors.age?.message} />
                )}
              />
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Gender" fullWidth error={!!errors.gender} helperText={errors.gender?.message}>
                    {choices.genders.map((m) => (
                      <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Category" fullWidth error={!!errors.category} helperText={errors.category?.message}>
                    {choices.categories.map((c) => (
                      <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Controller
                name="medium"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Medium" fullWidth error={!!errors.medium} helperText={errors.medium?.message}>
                    {choices.mediums.map((m) => (
                      <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Controller
                name="school"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="School" fullWidth error={!!errors.school} helperText={errors.school?.message}>
                    {choices.schools.map((s) => (
                      <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Controller
                name="batch"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Batch" fullWidth error={!!errors.batch} helperText={errors.batch?.message}>
                    {choices.batches.map((b) => (
                      <MenuItem key={b.id} value={b.id}>Batch {b.batch_no}</MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Stack>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} variant="contained">Submit</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default AddStudent;
