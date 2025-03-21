import React, { useState,useEffect } from "react";
import { Card, Avatar, Typography, message } from "antd";
import { CameraOutlined } from "@ant-design/icons";
import ProfileCardSkeleton from './Skeleton/ProfileCardSkeleton'
const { Title, Text } = Typography;


const ProfileCard = ({ user }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setProfileImage(user.image);
      setLoading(false);
    }, 1500);
  }, [user]);

  const handleUpload = (event) => {
    const uploadedFile = event.target.files[0];

    if (uploadedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        message.success("Profile picture updated successfully!");
      };
      reader.readAsDataURL(uploadedFile);
    }
  };

  if (loading) return <ProfileCardSkeleton />; 

  return (
    <Card
      style={{
        width: 380,
        textAlign: "center",
        borderRadius: "6px",
        background: "#ffffff",
        boxShadow: "0 1px 0 0 #cfd7df",
        border: "none",
      }}
    >
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

      <div style={{ marginTop: "25px", textAlign: "center" }}>
        <Title level={4}>{user.name}</Title>
        <Text type="secondary">{user.email}</Text>
      </div>

      <div style={{ marginTop: "20px", textAlign: "center", fontSize: "16px" }}>
        <Text strong>Role:</Text> {user.role} <br />
        <Text strong>Section:</Text> {user.section} <br />
        <Text strong>Joined:</Text> {user.date}
      </div>
    </Card>
  );
};

export default ProfileCard;