import React from "react";
import { Card,Skeleton } from "antd";

const ProfileCardSkeleton = () => (
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
    <Skeleton.Avatar active size={110} shape="circle" />
    <div style={{ marginTop: "25px", textAlign: "center",display:"flex",flexDirection:"column" }}>
      <Skeleton.Input active size="small" style={{ width: 100 }} />
      <Skeleton.Input active size="small" style={{ width: 200,height:20,marginTop:10 }} />
    </div>
    <div style={{ marginTop: "20px", textAlign: "center", fontSize: "16px" }}>
      <Skeleton.Input active size="small" style={{ width: 200 }} />
      <br />
      <Skeleton.Input active size="small" style={{ width: 180, marginTop: 8 }} />
      <br />
      <Skeleton.Input active size="small" style={{ width: 150, marginTop: 8 }} />
    </div>
  </Card>
);


export default ProfileCardSkeleton