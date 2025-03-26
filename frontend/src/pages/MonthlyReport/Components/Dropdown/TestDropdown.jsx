import React, { useState } from "react";
import { Dropdown, Menu, Button } from "antd";
import { format } from "date-fns";

const TestDropdown = ({ testDetails,selectedTest, setSelectedTest}) => {

  const handleMenuClick = (item) => {
    const selected = levelTests.find(
      (test) => test.id === Number(item.key)
    );
    setSelectedTest(selected);
  };

  const levelTests = testDetails.filter((item) => item.isLevelTest);

  const menu = (
    <Menu onClick={handleMenuClick}>
      {levelTests.length > 0 ? (
        levelTests.map((item) => (
          <Menu.Item key={item.id}>
            {item.test_name} -{" "}
            {format(new Date(item.created_at), "dd/MMM/yy")}
          </Menu.Item>
        ))
      ) : (
        <Menu.Item disabled>No Tests Available</Menu.Item>
      )}
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <Button>
        {selectedTest
          ? `${selectedTest.test_name} - ${format(
              new Date(selectedTest.created_at),
              "dd/MMM/yy"
            )}`
          : "Select Test"}
      </Button>
    </Dropdown>
  );
};

export default TestDropdown;
