import React, { useState } from "react";
import { Modal, DatePicker, Input } from "antd";
import {
  addHoliday,
  deleteHoliday,
  checkHoliday,
} from "../../../../api/attendanceAPI";
import { FwButton } from "@freshworks/crayons/react";

const AddHoliday = ({ reFetchFunction }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [reason, setReason] = useState("");
  const [isExistingHoliday, setIsExistingHoliday] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [reasonError, setReasonError] = useState("");

  const openModal = () => {
    setModalVisible(true);
    setSelectedDate(null);
    setReason("");
    setIsExistingHoliday(false);
    setDateError(false);
    setInputDisabled(true);
    setReasonError("");
  };

  const handleDateSelection = async (date) => {
    if (!date) return;
    setSelectedDate(date);
    setDateError(false);
    setLoading(true);

    try {
      const formattedDate = date.format("YYYY-MM-DD");
      const response = await checkHoliday(formattedDate);

      if (response?.is_holiday) {
        setReason(response.reason);
        setIsExistingHoliday(true);
        setInputDisabled(true);
      } else {
        setReason("");
        setIsExistingHoliday(false);
        setInputDisabled(false);
      }
    } catch (error) {
      console.error("Error checking holiday:", error);
      console.error("Failed to check holiday status.");
    } finally {
      setLoading(false);
    }
  };

  const handleHolidaySubmit = async () => {
    if (!selectedDate) {
      setDateError(true);
      return;
    }

    if (!reason.trim()) {
      setReasonError("Holiday reason is required");
      return;
    }

    try {
      const formattedDate = selectedDate.format("YYYY-MM-DD");
      await addHoliday({ date: formattedDate, reason });
      reFetchFunction();
      setModalVisible(false);
    } catch (error) {
      console.error("Error marking holiday:", error);
      console.error("Failed to mark holiday.");
    }
  };

  const handleHolidayRemove = async () => {
    try {
      const formattedDate = selectedDate.format("YYYY-MM-DD");
      await deleteHoliday(formattedDate);
      setModalVisible(false);
    } catch (error) {
      console.error("Error removing holiday:", error);
      console.error("Failed to remove holiday.");
    }
  };

  return (
    <div>
      <FwButton onFwClick={openModal}>Add Holiday</FwButton>
      <Modal
        title="Manage Holiday"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          
            <FwButton  color={isExistingHoliday?"danger":"primary"} onFwClick={isExistingHoliday?handleHolidayRemove:   handleHolidaySubmit}>
              {isExistingHoliday?"Remove Holiday":"Submit"}
            </FwButton>
          ,
          <FwButton key="cancel" color="secondary" style={{marginLeft:10}}  onFwClick={() => setModalVisible(false)}>
            Cancel
          </FwButton>,
        ]}
        zIndex={100002}
      >
        <DatePicker
          value={selectedDate}
          onChange={handleDateSelection}
          format="DD/MM/YYYY"
          disabledDate={(date) => date.day() === 0 || date.day() === 6}
        />
        {dateError && <p style={{ color: "red", marginTop: "5px" }}>Please select a date.</p>}

        <Input
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            setReasonError("");
          }}
          placeholder="Enter holiday reason"
          disabled={inputDisabled}
          style={{ marginTop: "10px" }}
        />
        {reasonError && <p style={{ color: "red", marginTop: "5px" }}>{reasonError}</p>}
      </Modal>
    </div>
  );
};

export default AddHoliday;
