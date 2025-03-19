import React, { useState } from "react";
import { Modal, Button, DatePicker, Input, message } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  addHoliday,
  deleteHoliday,
  checkHoliday,
} from "../../../../api/attendanceAPI";
import { FwButton } from "@freshworks/crayons/react";

// Validation schema using Yup
const schema = yup.object().shape({
  reason: yup
    .string()
    .trim()
    .matches(
      /^(?![\d!@#$%^&*()_+={}[\]:;"'<>,.?/~`-]+$).*$/,
      "Reason cannot be only numbers or symbols"
    )
    .required("Holiday reason is required"),
});

const AddHoliday = ({reFetchFunction}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isExistingHoliday, setIsExistingHoliday] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(true); // Initially disable input
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dateError, setDateError] = useState(false); // State to track date error

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { reason: "" },
  });

  // Open modal when "Add Holiday" button is clicked
  const openModal = () => {
    setModalVisible(true);
    setSelectedDate(null);
    reset(); // Reset form fields
    setIsExistingHoliday(false);
    setDateError(false); // Reset date error
    setInputDisabled(true); // Disable input initially
  };

  // Handle date selection
  const handleDateSelection = async (date) => {
    if (!date) return;

    setSelectedDate(date);
    setDateError(false); // Clear error when a date is selected
    setLoading(true);

    try {
      const formattedDate = date.format("YYYY-MM-DD");
      const response = await checkHoliday(formattedDate);

      if (response?.is_holiday) {
        setValue("reason", response.reason); // Set existing reason
        setIsExistingHoliday(true);
        setInputDisabled(true); // Disable input if already a holiday
      } else {
        setValue("reason", ""); // Clear input if not a holiday
        setIsExistingHoliday(false);
        setInputDisabled(false); // Enable input if not a holiday
      }
    } catch (error) {
      console.error("Error checking holiday:", error);
      message.error("Failed to check holiday status.");
    } finally {
      setLoading(false);
    }
  };

  // Submit new holiday
  const handleHolidaySubmit = (data) => {
    if (!selectedDate) {
      setDateError(true); // Show error for missing date
      return;
    }

    handleSubmit(async (data) => {
      try {
        const formattedDate = selectedDate.format("YYYY-MM-DD");
        await addHoliday({ date: formattedDate, reason: data.reason });
        reFetchFunction()
        message.success("Holiday marked successfully!");
        setModalVisible(false);
      } catch (error) {
        console.error("Error marking holiday:", error);
        message.error("Failed to mark holiday.");
      }
    })();
  };

  // Remove holiday
  const handleHolidayRemove = async () => {
    try {
      const formattedDate = selectedDate.format("YYYY-MM-DD");
      await deleteHoliday(formattedDate);

      message.success("Holiday removed successfully!");
      setModalVisible(false);
    } catch (error) {
      console.error("Error removing holiday:", error);
      message.error("Failed to remove holiday.");
    }
  };

  return (
    <div>

      <FwButton  onFwClick={openModal} >Add Holiday</FwButton>
      <Modal
        title="Manage Holiday"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          isExistingHoliday ? (
            <Button
              key="delete"
              type="primary"
              danger
              onClick={handleHolidayRemove}
            >
              Remove Holiday
            </Button>
          ) : (
            <Button key="submit" type="primary" onClick={handleHolidaySubmit}>
              Submit
            </Button>
          ),
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            Cancel
          </Button>,
        ]}
        zIndex={100002}
      >
        <DatePicker
          value={selectedDate}
          onChange={handleDateSelection}
          format="DD/MM/YYYY"
          disabledDate={(date) => date.day() === 0 || date.day() === 6} // Disable weekends
        />
        {dateError && (
          <p style={{ color: "red", marginTop: "5px" }}>
            Please select a date.
          </p>
        )}

        <Controller
          name="reason"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Enter holiday reason"
              disabled={inputDisabled} // Control input enable/disable dynamically
              style={{ marginTop: "10px" }}
            />
          )}
        />
        {errors.reason && (
          <p style={{ color: "red", marginTop: "5px" }}>
            {errors.reason.message}
          </p>
        )}
      </Modal>
    </div>
  );
};

export default AddHoliday;
