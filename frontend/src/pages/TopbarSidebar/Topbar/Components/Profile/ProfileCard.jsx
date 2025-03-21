import React, { useState } from "react";
import { Card, Avatar, Typography, message } from "antd";
import { CameraOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const ProfileCard = ({user}) => {

  const [profileImage, setProfileImage] = useState(user.image);

  // Handle File Upload
  const handleUpload = (event) => {
    const uploadedFile = event.target.files[0];

    if (uploadedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); // Convert image to base64
        message.success("Profile picture updated successfully!");
      };
      reader.readAsDataURL(uploadedFile);
    }
  };

  return (
    <>
     <Card
        style={{
          width: 380,
          textAlign: "center",
          borderRadius: "6px",
          background: "#ffffff",
          boxShadow: "0 1px 0 0 #cfd7df",
          border:"none"
        }}
      >
        {/* Profile Picture */}
        <div style={{ position: "relative", display: "inline-block", cursor: "pointer" }}>
          <input
            type="file"
            accept=".png, .jpeg, .jpg"
            style={{ display: "none" }}
            id="fileUpload"
            onChange={handleUpload}
          />
          <label htmlFor="fileUpload">
            <Avatar
              size={110}
              src={profileImage || "https://cdn-icons-png.flaticon.com/256/149/149071.png"}
              style={{
                cursor: "pointer",
                transition: "0.3s",
                border: "4px solid #e6e6e6",
              }}
            />
            {/* Camera Icon Overlay */}
            <CameraOutlined
              style={{
                position: "absolute",
                bottom: 5,
                right: 5,
                fontSize: "16px",
                background: "white",
                borderRadius: "50%",
                padding: "6px",
                boxShadow: "0 0 8px rgba(0, 0, 0, 0.15)",
              }}
            />
          </label>
        </div>

        {/* Profile Details */}
        <div style={{ marginTop: "25px", textAlign: "center" }}>
          <Title level={4} style={{ marginBottom: 0, color: "#333" }}>
            {user.name}
          </Title>
          <Text type="secondary" style={{ fontSize: "14px" }}>
            {user.email}
          </Text>
        </div>

        <div style={{ marginTop: "20px", textAlign: "center", fontSize: "16px" }}>
          <Text strong style={{ color: "#555" }}>Role:</Text> {user.role} <br />
          <Text strong style={{ color: "#555" }}>Section:</Text> {user.section}<br />
          <Text strong style={{ color: "#555" }}>Joined:</Text> {user.date} 
        </div>
    </Card>
    
    
    </>

     

  );
};

export default ProfileCard;
