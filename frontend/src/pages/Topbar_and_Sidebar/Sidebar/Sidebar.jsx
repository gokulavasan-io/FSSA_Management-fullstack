import { useState } from "react";
import { Layout, Menu, Button } from "antd";
import { 
  Home04Icon, 
  Calendar03Icon, 
  PieChartIcon, 
  TaskEdit02Icon, 
  NoteIcon, 
  SidebarRight01Icon, 
  SidebarLeft01Icon, 
  LibrariesIcon,
  
} from "hugeicons-react";
import './Sidebar.css'

const { Sider } = Layout;

const subjects = ["English", "Life Skills", "Tech", "Problem Solving", "PET", "Behavior"];
const analysis = ["Student", "Subject", "Class"];


function Sidebar({collapsed,setCollapsed}) {

  const [selectedKey, setSelectedKey] = useState("1");

  let menuItems=[
    {
      key: "1",
      icon: <Home04Icon size={22}/>,
      label: "Home",
    },
    {
      key: "subject",
      icon: <TaskEdit02Icon size={22}/>,
      label: "Assessments",
      children: subjects.map((subject, index) => ({
        key: `subject-${index}`,
        label: subject,
      })),
    },
    {
      key: "2",
      icon: <Calendar03Icon size={22}/>,
      label: "Attendance",
    },
    {
      key: "3",
      icon: <NoteIcon size={22}/>,
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
  ]

  return (
    <Sider
      collapsed={collapsed}
      onCollapse={setCollapsed}
      collapsible={false}
      width={220}
      collapsedWidth={65}
      theme="light"
      className="shadow-md relative"
      style={{ minHeight: "100vh", position: "fixed", left: 0}}

    >
      {/* Custom Toggle Button */}
      <Button
        type="text"
        icon={collapsed ? <SidebarRight01Icon size={18} /> : <SidebarLeft01Icon size={18} />}
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: "absolute",
          top: "15px",
          right: "-15px",
          background: "none",
          zIndex: 1000
        }}
      />

      {/* Logo (Toodle) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          padding: "16px",
          fontWeight: "bold",
          fontSize: collapsed ? "16px" : "20px",
          transition: "all 0.3s ease",
          whiteSpace: "nowrap",
         
        }}
      >
        {/* collapsed ? 24 : */}
        <LibrariesIcon size={ 28} color={collapsed?"#5D5FEF":"#737791"} />
        {!collapsed && <span style={{ marginLeft: "10px",color:"#5D5FEF" }}>Toodle</span>}
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
        openAnimation="zoom" // Add this for smoother opening

      />
    </Sider>
  );
}

export default Sidebar;
