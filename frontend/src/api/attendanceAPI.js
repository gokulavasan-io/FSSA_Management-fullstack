import axios from "axios";
import API_PATHS from "./apiPaths"


export const fetchAttendanceData = async (section,month,year) => {
    try {
      let response = await axios.get(
        `${API_PATHS.ATTENDANCE_DATA}?year=${year || ""}&month=${month || ""}&section_id=${section}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
};


export const updateAttendance = async (data) =>{
    try {
        await axios.put(API_PATHS.UPDATE_ATTENDANCE, { records: data });
        
    } catch (error) {
      throw error;
    }

}


export const fetchRemarks = async (section,month,year) => {
    try {
      let response = await axios.get(
        `${API_PATHS.FETCH_REMARKS}?year=${year || ""}&month=${month || ""}&section_id=${section || ""}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
};


export const  addRemark = async (remarkData) => {
    try {
      await axios.post(API_PATHS.ADD_REMARK, remarkData);
    } catch (error) {
      throw error;

    }
}

export const  deleteRemark = async (remarkData) => {
    try {
      await axios.delete(API_PATHS.ADD_REMARK, {data : remarkData});
      
    } catch (error) {
      throw error;

    }
}

export const checkHoliday = async (date) => {
  try {
    const response = await axios.get(`${API_PATHS.CHECK_HOLIDAY}?date=${date}`);
    return response.data;
    
  } catch (error) {
    throw error;
  }
};

export const fetchHolidays = async (section,month,year) => {
    try {
      let response = await axios.get(
        `${API_PATHS.FETCH_HOLIDAYS}?year=${year || ""}&month=${
          month || ""
        }&section_id=${section || ""}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
};




export const  addHoliday = async (holidayData) => {
    try {
      await axios.post(API_PATHS.ADD_HOLIDAY, holidayData);
      
    } catch (error) {
      throw error;

    }
}

export const  deleteHoliday = async (date) => {
    try {
        await axios.delete(API_PATHS.ADD_HOLIDAY, {
            data: { date },
          });
    } catch (error) {
      throw error;

    }
}


export const fetchDailyStatistics = async (section,month,year) => {
    try {
      let response = await axios.get(
        `${API_PATHS.FETCH_DAILYsTATISTICS}?year=${year || ""}&month=${
          month || ""
        }&section_id=${section || ""}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
};


export const fetchStudentStatistics = async (section,month,year) => {
    try {
      let response = await axios.get(
        `${API_PATHS.FETCH_STUDENTSTATISTICS}?year=${year || ""}&month=${
          month || ""
        }&section_id=${section || ""}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
};