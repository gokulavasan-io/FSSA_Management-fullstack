import React, { useEffect, useState } from "react";
import { Modal, Button } from "antd";
import ProfileCard from "./ProfileCard";
import { TiGroup } from "react-icons/ti";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../../../../api/axiosInstance";
import { format } from "date-fns";


const UserProfile = ({ isModalVisible, setIsModalVisible }) => {
  const location = useLocation();
  const [userData, setUserData] = useState({});

  function formatData(userData) {
      return {
        image: userData.image,
        name: userData.name || "",
        email: userData.email,
        role: userData.role_name,
        section: userData.section_name,
        date: format(new Date(userData.created_at), "dd/MMM/yy"),
      };
  }

  const fetchData = async () => {
    let userId = localStorage.getItem("userId") ;
    const response = await axiosInstance.get(`/teacher/members/${userId}/`);
     setUserData(formatData(response.data));
  };

  useEffect(() => {
    fetchData();
  }, [isModalVisible]);

  const user = {
    image: "https://randomuser.me/api/portraits/women/67.jpg",
    name: "John Doe",
    email: "johndoe@gmail.com",
    role: "Admin / Coach",
    section: "Class A",
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    setIsModalVisible(false);
  }, [location.pathname, setIsModalVisible]);

  return (
    <div className="flex justify-center items-center h-screen">
      <Modal
        title="Profile"
        open={isModalVisible}
        onCancel={handleClose}
        footer={null}
        centered
        width={"fit-content"}
      >
        <ProfileCard user={userData} />
        {location.pathname != "/team" && (
          <Link
            to="/team"
            style={{
              marginTop: 10,
              display: "flex",
              gap: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TiGroup size={18} />
            <p style={{ marginBottom: 0 }}>See your Team</p>
          </Link>
        )}
      </Modal>
    </div>
  );
};

export default UserProfile;
