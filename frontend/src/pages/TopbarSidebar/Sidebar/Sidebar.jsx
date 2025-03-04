import { Layout, Menu, Button } from "antd";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  Home04Icon,
  Calendar03Icon,
  PieChartIcon,
  TaskEdit02Icon,
  NoteIcon,
  LibrariesIcon,
} from "hugeicons-react";
import "./Sidebar.css";
import { useMainContext } from "../../../Context/MainContext";

const { Sider } = Layout;

const analysis = ["Student", "Subject", "Class"];

function Sidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const { subjects, setSelectedSubject, selectedKey, setSelectedKey } =useMainContext();

  const menuItems = [
    {
      key: "1",
      icon: <Home04Icon size={22} />,
      label: "Dashboard",
      onClick: () => {
        setSelectedKey("1");
        navigate("/"); 
      },
    },
    {
      key: "subject",
      icon: <TaskEdit02Icon size={22} />,
      label: "Assessments",
      children: subjects
        .filter((subject) => !subject.subject_name.includes("ttendance"))
        .map((subject) => ({
          key: `subject-${subject.id}`,
          label: subject.subject_name,
          onClick: () => {
            setSelectedKey("1");
            setSelectedSubject(subject);
            navigate("/assessment");
          },
        })),
    },
    {
      key: "2",
      icon: <Calendar03Icon size={22} />,
      label: "Attendance",
      onClick: () => {
        setSelectedKey("2");
        navigate("/attendance");
      },
    },
    {
      key: "3",
      icon: <NoteIcon size={22} />,
      label: "Monthly Report",
    },
    {
      key: "4",
      icon: <PieChartIcon size={22} />,
      label: "Analysis",
      children: analysis.map((category, index) => ({
        key: `analysis-${index}`,
        label: category,
      })),
    },
  ];

  return (
    <Sider
      collapsed={collapsed}
      onCollapse={setCollapsed}
      collapsible={false}
      width={220}
      collapsedWidth={65}
      theme="light"
      className="shadow-md relative"
      style={{
        minHeight: "100vh",
        position: "fixed",
        left: 0,
        zIndex: 10000,
        backgroundColor: "#12344d",
      }}
      onMouseLeave={() => {
        setTimeout(() => setCollapsed(true), 100); 
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "16px",
          fontWeight: "bold",
          fontSize: "20px",
          transition: "all 0.3s ease",
          whiteSpace: "nowrap",
          overflow: "hidden",
          cursor: "pointer",
          backgroundColor: "#0e2a3e",
        }}
        onMouseEnter={() => setCollapsed(false)}
        onClick={() => setCollapsed(false)}
      >
        <LibrariesIcon
          size={28}
          color={"white"}
          style={{ transition: "all 0.3s ease" }}
        />

        <span
          style={{
            marginLeft: "10px",
            color: "white",
            opacity: collapsed ? 0 : 1,
            maxWidth: collapsed ? "0px" : "100px",
            overflow: "hidden",
            transition: "opacity 0.7s ease, max-width 0.7s ease",
            display: "inline-block",
            whiteSpace: "nowrap",
          }}
        >
          Toodle
        </span>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        onClick={({ key }) => setSelectedKey(key)}
        className="border-none"
        inlineCollapsed={collapsed}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
        }}
        theme="light"
        items={menuItems}
      />
      ;
    </Sider>
  );
}

export default Sidebar;
