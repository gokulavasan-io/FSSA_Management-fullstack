import { useEffect } from "react";
import { Layout, Menu, Button } from "antd";
import { json, useNavigate } from "react-router-dom"; 
import "./Sidebar.css";
import { useMainContext } from "../../../Context/MainContext";
import { VscDashboard } from "react-icons/vsc";
import { LuNotebookPen } from "react-icons/lu"
import { BsCalendarCheck } from "react-icons/bs";
import ToodleLogo from "../../../../public/assets/Components/ToodleLogo";
import { BsJournalBookmark } from "react-icons/bs";
import { LuUserRoundCog } from "react-icons/lu";

const { Sider } = Layout;

const analytics = ["Test","Student","Member","Role", "Subject","Batch","Section","Holiday"];

function Sidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const { subjects, setSelectedSubject, selectedKey, setSelectedKey,setCategoryName } =useMainContext();

  const menuItems = [
    {
      key: "1",
      icon: <VscDashboard size={20} />,
      label: "Dashboard",
      onClick: () => {
        setSelectedKey("1");
        sessionStorage.setItem("selectedKey", 1);
        setSelectedSubject({subject_name:"Dashboard"});
        sessionStorage.setItem("selectedSubject", JSON.stringify({subject_name:"Dashboard"}));
        navigate("/"); 
      },
    },
    {
      key: "subject",
      icon: <LuNotebookPen size={20} />,
      label: "Assessments",
      children: subjects
        .filter((subject) => !subject.subject_name.includes("Attendance"))
        .map((subject) => ({
          key: `subject-${subject.id}`,
          label: subject.subject_name,
          onClick: () => {
            const selectedKey = `subject-${subject.id}`;
            setSelectedKey(selectedKey);
            setSelectedSubject(subject);
            sessionStorage.setItem("selectedSubject", JSON.stringify(subject));
            sessionStorage.setItem("selectedKey", selectedKey);
            navigate("/assessment");
          },
        })),
    },
    {
      key: "2",
      icon: <BsCalendarCheck size={20} />,
      label: "Attendance",
      onClick: () => {
        setSelectedKey("2");
        sessionStorage.setItem("selectedKey", 2);
        setSelectedSubject({subject_name:"Attendance"});
        sessionStorage.setItem("selectedSubject", JSON.stringify({subject_name:"Attendance"}));
        navigate("/attendance");
      },
    },
    {
      key: "3",
      icon: <BsJournalBookmark size={20} />,
      label: "Monthly Report",
      onClick: () => {
        setSelectedKey("3");
        sessionStorage.setItem("selectedKey", 3);
        setSelectedSubject({subject_name:"Monthly Report"});
        sessionStorage.setItem("selectedSubject", JSON.stringify({subject_name:"Monthly Report"}));
        navigate("/monthly_report"); 
      },
    },
    // {
    //   key: "4",
    //   icon: <MdInsertChartOutlined size={22} />,
    //   label: "Analytics",
    //   children: analytics.map((category, index) => ({
    //     key: `analytics-${index}`,
    //     label: category,
    //   })),
    // },
    {
      key: "5",
      icon: <LuUserRoundCog size={22} />,
      label: "admin",
      children: analytics.map((category, index) => ({
        key: `admin-${index}`,
        label: category,
        onClick: () => {
          const selectedKey = `admin-${index}`;
          setSelectedKey(selectedKey);
          setCategoryName(category);
          setSelectedSubject({subject_name:"Admin"});
          sessionStorage.setItem("selectedSubject", JSON.stringify({subject_name:"Admin"}));
          sessionStorage.setItem("selectedKey", selectedKey);
          sessionStorage.setItem("categoryName", category);
          navigate("/admin");
        },
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
