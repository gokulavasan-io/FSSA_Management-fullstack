import React, { useEffect, useState } from "react";
import { Modal, Button } from "antd";
import ProfileCard from "./ProfileCard";
import { TiGroup } from "react-icons/ti";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { format } from "date-fns";
import { fetchUserData } from "../../../../../api/generalAPI";


const UserProfile = ({ isModalVisible, setIsModalVisible }) => {
  const location = useLocation();
  const [userData, setUserData] = useState(null);

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
    const response = await fetchUserData(userId)
    setUserData(formatData(response));
  };

  useEffect(() => {
    if(isModalVisible){
      fetchData();
    }
  }, [isModalVisible]);

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
