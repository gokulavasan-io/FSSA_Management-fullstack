import { List, ListItem, ListItemText } from "@mui/material";
import { format } from "date-fns";
import { useMarksContext } from "../../../../Context/MarksContext";

const TestDetailSection = ({ isLevelSection }) => {

  const { handleOptionClick, testDetails } = useMarksContext();
  return (
    <List component="div" disablePadding>
      {/* Show message when no items available */}
      {testDetails.filter((item) =>
        isLevelSection
          ? item.isLevelTest
          : !item.isLevelTest
      ).length === 0 ? (
        <ListItem
          sx={{
            textAlign: "center",
            padding: "10px",
            color: "#000",
            marginLeft: 3,
          }}
        >
          No tests available
        </ListItem>
      ) : (
        testDetails
          .filter((item) =>
            isLevelSection
              ? item.isLevelTest
              : !item.isLevelTest
          )
          .map((item, index) => {
            return (
              <ListItem
                key={index}
                button={index.toString()}
                onClick={() => {
                  handleOptionClick(item.id, isLevelSection);
                }}
                sx={{
                  pl: 4,
                  "&:hover": { backgroundColor: "rgb(235, 239, 243)" },
                  marginBottom: 0.5,
                  cursor: "pointer",
                  opacity: 1,
                }}
              >
                <ListItemText
                  primary={
                    <>
                      <span style={{ fontWeight: 500 }}>
                        {" "}
                        {item.test_name}{" "}
                      </span>
                      <span style={{ fontSize: 14, marginLeft: 10 }}>
                        {format(
                          new Date(item.created_at),
                          "dd/MMM/yy"
                        )}
                      </span>
                    </>
                  }
                  sx={{ color: "#555", cursor: "pointer" }}
                />
              </ListItem>
            );
          })
      )}
    </List>
  );
};

export default TestDetailSection;
