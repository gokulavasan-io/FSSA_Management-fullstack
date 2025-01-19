import { useDrop } from "../../../utils/dragAndDropImports.js";
import { List, ListItem } from "../../../utils/materialImports.js";
import DraggableTestItem from "./dragAndDrop.jsx";

const TestsSection = ({ testDetails, onOptionClick, handleDrop, target }) => {
  const [, drop] = useDrop(() => ({
    accept: "test",
    drop: (item) => handleDrop(item, target),
    canDrop: () => true, // Allow drop even if there are no items
  }));

  return (
    <List ref={drop} component="div" disablePadding>
      {/* Show message when no items available */}
      {testDetails.filter(
        (item) =>
          (target === "marks" && !item.test_detail.isArchived &&!item.test_detail.isLevelTest) ||
          (target === "archived" && item.test_detail.isArchived && !item.test_detail.isLevelTest) 
      ).length === 0 ? (
        <ListItem sx={{ textAlign: "center", padding: "10px", color: "#000" }}>
          No tests available
        </ListItem>
      ) : (
        testDetails.map((item, index) => {
          if (
            (target === "marks" && !item.test_detail.isArchived && !item.test_detail.isLevelTest) ||
            (target === "archived" && item.test_detail.isArchived && !item.test_detail.isLevelTest)
          ) {
            return (
              <DraggableTestItem
                key={index}
                item={item}
                onOptionClick={onOptionClick}
              />
            );
          }
          return null;
        })
      )}
    </List>
  );
};

export default TestsSection;
