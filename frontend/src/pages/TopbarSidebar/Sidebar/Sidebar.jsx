import { Layout, Menu, Button } from "antd";
import { useNavigate } from "react-router-dom"; 
import "./Sidebar.css";
import { useMainContext } from "../../../Context/MainContext";
import { VscDashboard } from "react-icons/vsc";
import { LuNotebookPen } from "react-icons/lu"
import { BsCalendarCheck } from "react-icons/bs";
import { MdInsertChartOutlined } from "react-icons/md";
import ToodleLogo from "../../../../public/assets/icons/ToodleLogo";
import { BsJournalBookmark } from "react-icons/bs";

const { Sider } = Layout;

const analytics = ["Student", "Subject", "Class"];

function Sidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const { subjects, setSelectedSubject, selectedKey, setSelectedKey } =useMainContext();

  const menuItems = [
    {
      key: "1",
      icon: <VscDashboard size={22} />,
      label: "Dashboard",
      onClick: () => {
        setSelectedKey("1");
        navigate("/"); 
      },
    },
    {
      key: "subject",
      icon: <LuNotebookPen size={21} />,
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
      icon: <BsCalendarCheck size={21} />,
      label: "Attendance",
      onClick: () => {
        setSelectedKey("2");
        navigate("/attendance");
      },
    },
    {
      key: "3",
      icon: <BsJournalBookmark size={21} />,
      label: "Monthly Report",
    },
    {
      key: "4",
      icon: <MdInsertChartOutlined size={23} />,
      label: "Analytics",
      children: analytics.map((category, index) => ({
        key: `analytics-${index}`,
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
        <ToodleLogo
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
