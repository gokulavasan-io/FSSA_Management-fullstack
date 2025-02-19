import {
  List,
  ListItem,
  ListItemText,

} from '@mui/material';
  import { format } from 'date-fns';

  import { useMarksContext } from "../../../../Context/MarksContext.jsx";
  
  const LevelSection = () => {
    const { testDetails, handleOptionClick } = useMarksContext();
  
    return (
      <List component="div" disablePadding>
        {/* Show message when no items available */}
        {testDetails.filter((item) => item.test_detail.isLevelTest).length ===
        0 ? (
          <ListItem sx={{ textAlign: "center", padding: "10px", color: "#000" }}>
            No tests available
          </ListItem>
        ) : (
          testDetails
            .filter((item) => item.test_detail.isLevelTest)
            .map((item, index) => {
              return (
                <ListItem
                  button
                  onClick={() => {
                    handleOptionClick(item.test_detail.id, true);
                  }}
                  sx={{
                    pl: 4,
                    borderRadius: "8px",
                    "&:hover": { backgroundColor: "#e3f2fd" },
                    marginBottom: 0.5,
                    cursor: "pointer",
                    opacity: 1,
                  }}
                >
                  <ListItemText
                    primary={
                      <>
                        <span style={{ fontWeight: "bold" }}>
                          {" "}
                          {item.test_detail.test_name}{" "}
                        </span>
                        {format(
                          new Date(item.test_detail.created_at),
                          "dd/MMM/yy"
                        )}
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
  
  export default LevelSection;
  