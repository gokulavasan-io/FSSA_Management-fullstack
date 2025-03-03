import axios from "axios";
import { HOME_API_ENDPOINTS } from "./apiPaths";


export const fetchAttendanceReport = async (section,date,batch) => {
    try {
      let response= await axios.get(`${HOME_API_ENDPOINTS.ATTENDANCE_REPORT}?date=${date}&section_id=${section}&batch=${batch}`)
      return response.data;
    } catch (error) {
      throw error;
    }
  };