import React, { useState, useRef, useEffect } from "react";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { IconButton, Popper, ClickAwayListener } from "@mui/material";
import { calendarBgImg } from "../../../public/assets/images/imagePaths.js";
import CalendarIcon from "../../../public/assets/icons/ic_calendar.jsx";

const CalendarPopup = () => {
  const [open, setOpen] = useState(false);
  const calendarRef = useRef(null);
  const iconRef = useRef(null);

  const toggleCalendar = () => {
    setOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target) &&
        !iconRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <IconButton ref={iconRef} onClick={toggleCalendar}>
        <CalendarIcon />
      </IconButton>

      <Popper
        open={open}
        anchorEl={iconRef.current}
        placement="bottom-start"
        style={{
          zIndex: 1000000000,
          position: "absolute",
          backgroundImage: `url(${calendarBgImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          //   backgroundColor:'rgb(255, 255, 255)',
          borderRadius: "8px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.51)",
          minWidth: "220px",
          border: "1px solid #ddd",
          transition: "none",
        }}
      >
        <ClickAwayListener onClickAway={handleClickAway}>
          <div ref={calendarRef}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar />
            </LocalizationProvider>
          </div>
        </ClickAwayListener>
      </Popper>
    </div>
  );
};

export default CalendarPopup;
