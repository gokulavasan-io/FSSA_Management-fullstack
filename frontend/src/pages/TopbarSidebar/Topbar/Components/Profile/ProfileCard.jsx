import React, { useState,useEffect } from "react";
import { Card, Avatar, Typography } from "antd";
import ProfileCardSkeleton from './Skeleton/ProfileCardSkeleton'
const { Title, Text } = Typography;

const ProfileCard = ({ user }) => {
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, [user]);

 

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
        <Avatar
            size={110}
            src={user.image || "https://cdn-icons-png.flaticon.com/256/149/149071.png"}
            style={{
              cursor: "pointer",
              transition: "0.3s",
              border: "4px solid #e6e6e6",
            }}
          />
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