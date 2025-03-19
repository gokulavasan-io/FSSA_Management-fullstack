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
import { MdHome } from "react-icons/md";
import { useMainContext } from "../../../Context/MainContext";
import "./Topbar.css"
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { TiGroup } from "react-icons/ti";
import { FaUser } from "react-icons/fa6";
import { IoMdBookmark } from "react-icons/io";
import { FiLogOut } from "react-icons/fi";

const { Header } = Layout;
const { Text } = Typography;

function TopBar({ collapsed }) {
  let userPicLink=localStorage.getItem("pictureLink")
  const location = useLocation();

  const { months, selectedMonth, setSelectedMonth, selectedSubject,userRole,userName,sectionName,categoryName } = useMainContext();
 
 
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
          <FaUser size={14} /> Profile
        </div>
      </Menu.Item>
      <Menu.Item key="2">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <IoMdBookmark size={16} /> Batch : 4
        </div>
      </Menu.Item>
      <Menu.Item key="3">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <TiGroup size={16} /> Your team
        </div>
      </Menu.Item>
      <Menu.Item key="4">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FiLogOut size={16} /> Logout
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Header
        style={{
          position: "fixed",
          width: collapsed ? "calc(100% - 65px)" : "calc(100% - 220px)",
          height:60,
          top: 0,
          right: 0,
          zIndex: 10000,
          background: "#fff",
          borderBottom:"#d6dbdf 1px solid",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 30px",
          transition: "width 0.3s ease-in-out", 
        }}
      >
        <Breadcrumb separator=">">
          <Breadcrumb.Item>
            <Link to="/">
              <MdHome size={20} />
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{selectedSubject.subject_name}</Breadcrumb.Item>
          {location.pathname =="/admin" &&<Breadcrumb.Item>{categoryName}</Breadcrumb.Item>}

          {location.pathname !== "/" &&location.pathname !== "/admin" && (
            <Breadcrumb.Item>
              <Dropdown overlay={monthMenu} trigger={["click"]}>
                <span style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                  {selectedMonth.month_name} <MdOutlineKeyboardArrowDown size={16} />
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
                style={{ borderRadius: "4px" }}
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
