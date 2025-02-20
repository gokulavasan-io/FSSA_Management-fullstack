import React, { useState, useEffect } from "react";
import { Select } from "antd";
import { submitTestData } from "../../../../api/marksAPI.js";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import useNotification from "../../../UxComponents/Notification.jsx";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  FormControl,
  FormHelperText,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import { useMainContext } from "../../../../Context/MainContext.jsx";
import { useMarksContext } from "../../../../Context/MarksContext.jsx";

const { Option } = Select;

const AdminTestForm = () => {
  const { openNewTestForm, setOpenNewTestForm, batchNumber } =
    useMarksContext();
  const { months, subjects } = useMainContext();
  const showMessage = useNotification();

  const [formData, setFormData] = useState({
    test_name: "",
    month: "",
    subject: "",
    total_marks: "",
    about_test: "",
    created_at: "",
    isLevelTest: false,
    batch: batchNumber,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isProblemSolving, setIsProblemSolving] = useState(false);

  const handleChange = (e) => {
    const { name, type, checked } = e.target
      ? e.target
      : { name: e.name, type: "select", checked: e.checked }; // Safe destructuring

    if (e.target) {
      let value = e.target.value;
      if (name == "test_name") {
        value = value.charAt(0).toUpperCase() + value.slice(1);
      }
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    } else if (e.name) {
      if (e.name == "subject") {
        let value = e.value;
        if (value) {
          const selectedSubject = subjects.find(
            (subject) => subject.id === value
          );
          if (selectedSubject.subject_name.toLowerCase().includes("problem")) {
            setIsProblemSolving(true);
          } else {
            setIsProblemSolving(false);
          }
        }
      }

      setFormData({
        ...formData,
        [e.name]: e.value,
      });
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      created_at: date ? date.format("YYYY-MM-DD") : "",
    });
  };

  const validateForm = () => {
    const newErrors = {};

    const testNameRegex = /^[A-Za-z0-9\s]+$/;
    if (!formData.test_name || !testNameRegex.test(formData.test_name)) {
      newErrors.test_name =
        "Test Name must contain only letters, numbers, and spaces.";
    }

    if (!formData.month) {
      newErrors.month = "Please select a month";
    }

    if (!formData.subject) {
      newErrors.subject = "Please select a subject.";
    }

    if (!formData.isLevelTest) {
      if (
        !formData.total_marks ||
        isNaN(formData.total_marks) ||
        formData.total_marks <= 0
      ) {
        newErrors.total_marks = "Enter a valid total mark.";
      } else if (formData.total_marks >= 1000) {
        newErrors.total_marks = "Total Marks should not be greater than 1000";
      }
    }

    if (!formData.about_test || formData.about_test.length < 5) {
      newErrors.about_test = "About Test must be at least 5 characters long.";
    }

    if (!formData.created_at) {
      newErrors.created_at = "Please select a valid date.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    if (formData.isLevelTest) {
      formData.total_marks = 0;
    }
    if (!isProblemSolving) {
      formData.isLevelTest = false;
    }

    try {
      const response = await submitTestData(formData);
      showMessage(response.message, "s");

      setFormData({
        test_name: "",
        month: "",
        subject: "",
        total_marks: "",
        about_test: "",
        created_at: "",
        isLevelTest: false,
        batch: 4,
      });

      setOpenNewTestForm(false); // Close the popup after successful submit
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrors({ test_name: error.response.data.message });
      } else {
        showMessage("Failed to submit test data. Please try again.", "e");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      test_name: "",
      month: "",
      subject: "",
      total_marks: "",
      about_test: "",
      created_at: "",
      isLevelTest: false,
      batch: 4,
    });
    setErrors({});
    setOpenNewTestForm(false); // Close the popup when canceled
  };

  return (
    <>
      <Dialog
        open={openNewTestForm}
        onClose={handleCancel}
        maxWidth="sm"
        fullWidth
        style={{ zIndex: 10000 }}
      >
        <DialogTitle>Add New Test</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="Test Name"
              name="test_name"
              value={formData.test_name}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errors.test_name}
              helperText={errors.test_name}
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl
                  fullWidth
                  margin="normal"
                  error={!!errors.subject}
                  required
                >
                  <Select
                    name="subject"
                    value={formData.subject}
                    onChange={(value) =>
                      handleChange({ name: "subject", value })
                    }
                    required
                    style={{ width: "100%" }}
                  >
                    <Option value="">Select Subject</Option>
                    {subjects.map((subject) => (
                      <Option key={subject.id} value={subject.id}>
                        {subject.subject_name}
                      </Option>
                    ))}
                  </Select>
                  <FormHelperText>{errors.subject}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl
                  fullWidth
                  margin="normal"
                  error={!!errors.month}
                  required
                >
                  <Select
                    name="month"
                    value={formData.month}
                    onChange={(value) => handleChange({ name: "month", value })}
                    required
                    style={{ width: "100%" }}
                  >
                    <Option value="">Select Month</Option>
                    {months.map((month) => (
                      <Option key={month.id} value={month.id}>
                        {month.month_name}
                      </Option>
                    ))}
                  </Select>
                  <FormHelperText>{errors.month}</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>

            {!isProblemSolving && (
              <TextField
                fullWidth
                type="number"
                label="Total Marks"
                name="total_marks"
                value={formData.total_marks}
                onChange={handleChange}
                margin="normal"
                required
                error={!!errors.total_marks}
                helperText={errors.total_marks}
              />
            )}

            {isProblemSolving && (
              <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="center"
              >
                {
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.isLevelTest}
                          onChange={handleChange}
                          name="isLevelTest"
                        />
                      }
                      label="Is level up test ?"
                    />
                  </Grid>
                }
                <Grid item xs={6}>
                  {!formData.isLevelTest && (
                    <TextField
                      fullWidth
                      type="number"
                      label="Total Marks"
                      name="total_marks"
                      value={formData.total_marks}
                      onChange={handleChange}
                      margin="normal"
                      required
                      error={!!errors.total_marks}
                      helperText={errors.total_marks}
                    />
                  )}
                </Grid>
              </Grid>
            )}

            <TextField
              fullWidth
              label="About Test"
              name="about_test"
              value={formData.about_test}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={1}
              required
              error={!!errors.about_test}
              helperText={errors.about_test}
            />

            <FormControl
              fullWidth
              margin="normal"
              error={!!errors.created_at}
              required
            >
              <LocalizationProvider dateAdapter={AdapterDayjs} >
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    label="Date"
                    value={
                      formData.created_at ? dayjs(formData.created_at) : null
                    }
                    onChange={handleDateChange}
                    format="DD-MM-YYYY"
                    required
                    slotProps={{
                      textField: {
                        size: "small",
                        sx: {
                          width: "auto",
                        },
                      },
                      popper: { sx: { zIndex: 10000 } }
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
              <FormHelperText>{errors.created_at}</FormHelperText>
            </FormControl>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  type="button"
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  fullWidth
                  sx={{ mt: 2 }}
                  loading={loading}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminTestForm;
