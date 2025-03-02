import axios from "axios";
import API_PATHS from "./apiPaths"

export const submitTestData = async (testData) => {
  try {
    const response = await axios.post(`${API_PATHS.POST_MARK}`, testData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchAllTestMarksForMonth = async (section,month,subject) => {
  try {
    let response= await axios.get(`${API_PATHS.GET_ALL_DATA}?section_id=${section}&month=${month}&subject=${subject}`)
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateMarks = async (testId,data) => {
  try {
    let response= await axios.put(`${API_PATHS.UPDATE_MARK}${testId}/`, data)
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchTestDetails = async (month,subject) => {
  try {
    let response= await axios.get(`${API_PATHS.GET_ALL_TEST_DETAILS}?month=${month}&subject=${subject}`)
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchTestData = async (testId,sectionId) => {
  try {
    const apiUrl = `${API_PATHS.GET_MARK}${testId}/?section_id=${sectionId}`
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    throw error;
  }
};




export const fetchLevels = async (testId) => {
  try {
    const response = await axios.get(`${API_PATHS.GET_LEVEL}${testId}/`)
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const updateLevels = async (testId,data) => {
  try {
    let response = axios.put(`${API_PATHS.UPDATE_LEVEL}${testId}/`, data)
    return response.data;
  } catch (error) {
    throw error;
  }
};