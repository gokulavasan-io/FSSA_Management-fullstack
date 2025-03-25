import axios from "./axiosInstance";
import {MARKS_API_ENDPOINTS} from "./apiPaths"

export const submitTestData = async (testData) => {
  try {
    const response = await axios.post(`${MARKS_API_ENDPOINTS.TESTS}`, testData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchAllTestMarksForMonth = async (section,month,subject) => {
  try {
    let response= await axios.get(`${MARKS_API_ENDPOINTS.MONTHLY_DATA}?month=${month}&subject=${subject}`)
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateMarks = async (testId,data) => {
  try {
    let response= await axios.put(`${MARKS_API_ENDPOINTS.TESTS}${testId}/`, data)
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchTestDetails = async (month,subject) => {
  try {
    let response= await axios.get(`${MARKS_API_ENDPOINTS.TESTDETAILS}?month=${month}&subject=${subject}`)
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchTestData = async (testId,sectionId) => {
  try {
    const apiUrl = `${MARKS_API_ENDPOINTS.TESTS}${testId}/?section_id=${sectionId}`
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const fetchLevels = async (testId) => {
  try {
    const response = await axios.get(`${MARKS_API_ENDPOINTS.LEVELTESTS}${testId}/`)
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const updateLevels = async (testId,data) => {
  try {
    let response = await axios.put(`${MARKS_API_ENDPOINTS.LEVELTESTS}${testId}/`, data)
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getTestDetails = async () => {
  try {
    const response = await axios.get(`${MARKS_API_ENDPOINTS.TESTDETAILS}`)
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteTest = async (testId) => {
  try {
    const response = await axios.delete(`${MARKS_API_ENDPOINTS.TESTDETAILS}${testId}/`)
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTest = async (testId, updatedData) => {
  try {
      const response = await axios.put(`${MARKS_API_ENDPOINTS.TESTDETAILS}${testId}/`, updatedData);
      return response.data;
  } catch (error) {
      console.error("Error updating test:", error);
  }
};