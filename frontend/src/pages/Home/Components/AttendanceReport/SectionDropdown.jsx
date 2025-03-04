import React from "react";
import { Dropdown, Menu, Button, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";

const SectionDropdown = ({ sections, selectedSection, setSelectedSection }) => {
  const sectionMenu = (
    <Menu
      onClick={(e) => {
        const selected = sections.find((section) =>
          section.id !== null ? section.id.toString() === e.key : e.key === "null"
        );
        if (selected) setSelectedSection(selected);
      }}
    >
      {sections.map((section) => (
        <Menu.Item key={section.id !== null ? section.id.toString() : "null"}>
          {section.name}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown overlay={sectionMenu} trigger={["click"]}>
      <span style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", position: "absolute", top: 60, right: 20 }}>
        <Button>
          <Space>
            {selectedSection?.name || "Loading..."} <DownOutlined />
          </Space>
        </Button>
      </span>
    </Dropdown>
  );
};

export default SectionDropdown;
