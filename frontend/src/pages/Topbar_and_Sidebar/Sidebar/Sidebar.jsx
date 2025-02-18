import { useState } from "react";
import { Layout, Menu, Button } from "antd";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { 
  Home04Icon, 
  Calendar03Icon, 
  PieChartIcon, 
  TaskEdit02Icon, 
  NoteIcon, 
  SidebarRight01Icon, 
  SidebarLeft01Icon, 
  LibrariesIcon
} from "hugeicons-react";
import './Sidebar.css';

const { Sider } = Layout;

const subjects = ["English", "Life Skills", "Tech", "Problem Solving", "PET", "Behavior"];
const analysis = ["Student", "Subject", "Class"];

function Sidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate(); // Initialize navigation hook
  const [selectedKey, setSelectedKey] = useState("1");

  const menuItems = [
    {
      key: "1",
      icon: <Home04Icon size={22} />,
      label: "Home",
      onClick: () => {
        setSelectedKey("1"); // Ensure selectedKey updates correctly
        navigate("/"); // Navigate to home
      },
    },
    {
      key: "subject",
      icon: <TaskEdit02Icon size={22} />,
      label: "Assessments",
      children: subjects.map((subject, index) => ({
        key: `subject-${index}`,
        label: subject,
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
  
  // Inside return statement
  <Menu
    mode="inline"
    selectedKeys={[selectedKey]}
    onClick={({ key }) => setSelectedKey(key)} // Avoid unnecessary re-renders
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
  

  return (
    <Sider
    collapsed={collapsed}
    onCollapse={setCollapsed}
    collapsible={false}
    width={220}
    collapsedWidth={65}
    theme="light"
    className="shadow-md relative"
    style={{ minHeight: "100vh", position: "fixed", left: 0, zIndex: 1000000,borderTopRightRadius:"10px",borderBottomRightRadius:"10px",boxShadow:"0 2px 8px rgba(0, 0, 0, 0.1)" }}
    onMouseLeave={() => {
      setTimeout(() => setCollapsed(true), 100); // Adds a small delay
    }}
    
  > 

      {/* Logo (Toodle) */}
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
    cursor:"pointer" 
  }}
    onMouseEnter={() => setCollapsed(false)} 
    onClick={() => setCollapsed(false)}
>
  {/* Icon - Always Visible */}
  <LibrariesIcon 
    size={28} 
    color={collapsed ? "#5D5FEF" : "#737791"} 
    style={{ transition: "all 0.3s ease" }} 
  />

  {/* Text - Smooth Fade & Width Transition */}
  <span 
    style={{ 
      marginLeft: "10px",
      color: "#5D5FEF",
      opacity: collapsed ? 0 : 1,  // Smooth fade effect
      maxWidth: collapsed ? "0px" : "100px", // Prevents sudden jumps
      overflow: "hidden",  // Hides text when collapsed
      transition: "opacity 0.7s ease, max-width 0.7s ease",
      display: "inline-block", // Ensures proper transition
      whiteSpace: "nowrap" // Prevents line breaks
    }}
  >
    Toodle
  </span>
</div>



      {/* Menu */}
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
      
    </Sider>
  );
}

export default Sidebar;
