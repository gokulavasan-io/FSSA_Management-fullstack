import React from "react";
import { Modal, Button, Typography } from "antd";

const { Text } = Typography;

const ConfirmationDialog = ({ open, onClose, title, content, onConfirm, confirmText = "Confirm", cancelText = "Cancel" }) => {
  return (
    <Modal
      open={open}
      onCancel={() => onClose(false)}
      footer={null}
      centered
      title={<Text strong style={{ fontSize: "1.5rem", color: "#1677ff" }}>{title}</Text>}
      zIndex={100003}
    >
      <Text style={{ display: "block", textAlign: "center", color: "#595959" }}>{content}</Text>
      <div style={{ display: "flex", justifyContent: "space-around", marginTop: 16 }}>
        <Button onClick={() => onClose(false)}>{cancelText}</Button>
        <Button type="primary" onClick={() => onClose(true)}>{confirmText}</Button>
      </div>
    </Modal>
  );
};

export default ConfirmationDialog;
