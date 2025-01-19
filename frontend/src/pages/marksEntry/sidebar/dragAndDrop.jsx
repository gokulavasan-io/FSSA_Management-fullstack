import { useDrag } from "../../../utils/dragAndDropImports";
import { ListItem, ListItemText } from "../../../utils/materialImports";
import { format } from "../../../utils/dateImports";

const   DraggableTestItem = ({ item, onOptionClick }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "test",
    item: item.test_detail,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <ListItem
      ref={drag}
      button
      onClick={() => {
        onOptionClick(item.test_detail.id,false);
      }}
      sx={{
        pl: 4,
        borderRadius: "8px",
        "&:hover": { backgroundColor: "#e3f2fd" },
        marginBottom: 0.5,
        cursor: "pointer",
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <ListItemText
        primary={
          <>
            <span style={{ fontWeight: "bold" }}>
              {" "}
              {item.test_detail.test_name}{" "}
            </span>
            {format(new Date(item.test_detail.created_at), "dd/MMM/yy")}
          </>
        }
        sx={{ color: "#555", cursor: "pointer" }}
      />
    </ListItem>
  );
};

export default DraggableTestItem;
