import {
  Layout,
  Avatar,
  Dropdown,
  Menu,
  Badge,
  Breadcrumb,
  Typography,
} from "antd";
import { BellOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowDown01Icon,
  BookOpen01Icon,
  Home04Icon,
  Logout01Icon,
  UserGroupIcon,
  UserIcon,
} from "hugeicons-react";
import { useMainContext } from "../../../Context/MainContext";
import "./Topbar.css"

const { Header } = Layout;
const { Text } = Typography;

function TopBar({ collapsed }) {
  let userPicLink=localStorage.getItem("pictureLink")
  const location = useLocation();

  const { months, selectedMonth, setSelectedMonth, selectedSubject,userRole,userName,sectionName } = useMainContext();
 
 
  const monthMenu = (
    <Menu
      onClick={(e) => {
        const selected = months.find((month) => month.id.toString() === e.key);
        if (selected) setSelectedMonth(selected);
      }}
    >
      {months.map((month) => (
        <Menu.Item key={month.id}>{month.month_name}</Menu.Item>
      ))}
    </Menu>
  );

  const userMenu = (
    <Menu>
      <Menu.Item key="1">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <UserIcon size={16} /> Profile
        </div>
      </Menu.Item>
      <Menu.Item key="2">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <BookOpen01Icon size={16} /> Batch : 4
        </div>
      </Menu.Item>
      <Menu.Item key="3">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <UserGroupIcon size={16} /> Your team
        </div>
      </Menu.Item>
      <Menu.Item key="4">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Logout01Icon size={16} /> Logout
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Header
        style={{
          position: "fixed",
          width: collapsed ? "calc(100% - 70px)" : "calc(100% - 225px)",
          top: 0,
          right: 0,
          zIndex: 10000,
          background: "#fff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 30px",
          borderTopLeftRadius: "8px",
          borderBottomLeftRadius: "8px",
          transition: "width 0.3s ease-in-out", // Smooth transition
        }}
      >
        <Breadcrumb separator=">">
          <Breadcrumb.Item>
            <Link to="/">
              <Home04Icon size={20} />
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{selectedSubject.subject_name}</Breadcrumb.Item>

          {location.pathname !== "/" && (
            <Breadcrumb.Item>
              <Dropdown overlay={monthMenu} trigger={["click", "hover"]}>
                <span style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                  {selectedMonth.month_name} <ArrowDown01Icon size={16} />
                </span>
              </Dropdown>
            </Breadcrumb.Item>
        )}
        </Breadcrumb>

        <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
          <Badge dot>
            <BellOutlined
              style={{ fontSize: "20px", cursor: "pointer", color: "#737791" }}
            />
          </Badge>

          <Dropdown overlay={userMenu} placement="bottomRight">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                gap: "12px",
              }}
            >
              <Avatar
                src={userPicLink}
                size={45}
                style={{ borderRadius: "8px" }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                }}
              >
                <Text strong style={{ fontSize: "15px", color: "#333" }}>
                  {userName.split(" ")[0]}
                </Text>
                <Text
                  type="secondary"
                  style={{ fontSize: "13px", color: "#737791" }}
                >
                  {userRole} - {sectionName}
                </Text>
              </div>
            </div>
          </Dropdown>
        </div>
      </Header>
    </>
  );
}

export default TopBar;
