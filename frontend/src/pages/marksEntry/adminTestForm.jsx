
import React, { useState } from "react";
import { TextField, Button, Checkbox, FormControlLabel, Card, CardContent, Typography } from "@mui/material";
import { submitTestData } from "../../api/marksAPI";
import {dayjs,DemoContainer,AdapterDayjs,LocalizationProvider,DatePicker} from "../../utils/dateImports.js";

const AdminTestForm = () => {
  const [formData, setFormData] = useState({
    test_name: "",
    month: "",
    subject: "",
    total_marks: "",
    about_test: "",
    created_at: "",
    isLevelTest: false,
    batch: 4,
  });



  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle Date change, ensure it's in the correct format ('YYYY-MM-DD')
  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      created_at: date ? date.format("YYYY-MM-DD") : "",  // Format the selected date as 'YYYY-MM-DD'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitTestData(formData);
      alert("Test data successfully submitted!");
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
    } catch (error) {
      alert("Failed to submit test data. Please try again.");
    }
  };

  return (
    <Card sx={{ maxWidth: 600, margin: "50px auto", padding: "20px" }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Admin Test Data Entry
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Test Name"
            name="test_name"
            value={formData.test_name}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Month (e.g., January)"
            name="month"
            value={formData.month}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            type="number"
            label="Total Marks"
            name="total_marks"
            value={formData.total_marks}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="About Test"
            name="about_test"
            value={formData.about_test}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
            required
          />

          
           {/* Date Picker for 'created_at' */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker
                label="Date"
                value={formData.created_at ? dayjs(formData.created_at) : null} 
                onChange={handleDateChange}  
                format="DD-MM-YYYY" 
                required
                slotProps={{
                  textField: {
                    size: 'small',
                    sx: {
                      width: 'auto',
                    },
                  },
                }}
              />
            </DemoContainer>
          </LocalizationProvider>

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isLevelTest}
                onChange={handleChange}
                name="isLevelTest"
              />
            }
            label="Is Level Test?"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminTestForm;
