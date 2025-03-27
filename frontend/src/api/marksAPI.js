import axiosInstance from "./axiosInstance";
import { MARKS_API_ENDPOINTS } from "./apiPaths";

export const submitTestData = async (testData) => {
  const response = await axiosInstance.post(`${MARKS_API_ENDPOINTS.TESTS}`, testData);
  return response.data;
};

export const fetchAllTestMarksForMonth = async (section, month, subject) => {
  let response = await axiosInstance.get(`${MARKS_API_ENDPOINTS.MONTHLY_DATA}?month=${month}&subject=${subject}&section=${section}`);
  return response.data;
};

export const fetchTestDetails = async (month, subject) => {
  let response = await axiosInstance.get(`${MARKS_API_ENDPOINTS.TESTDETAILS}?month=${month}&subject=${subject}`);
  return response.data;
};

export const updateMarks = async (testId, data) => {
  let response = await axiosInstance.put(`${MARKS_API_ENDPOINTS.TESTS}${testId}/`, data);
  return response.data;
};

export const fetchMarks = async (testId, sectionId) => {
  const response = await axiosInstance.get(`${MARKS_API_ENDPOINTS.TESTS}${testId}/?section_id=${sectionId}`);
  return response.data;
};

export const fetchLevels = async (testId) => {
  const response = await axiosInstance.get(`${MARKS_API_ENDPOINTS.LEVELTESTS}${testId}/`);
  return response.data;
};

export const updateLevels = async (testId, data) => {
  let response = await axiosInstance.put(`${MARKS_API_ENDPOINTS.LEVELTESTS}${testId}/`, data);
  return response.data;
};

export const getTestDetails = async () => {
  const response = await axiosInstance.get(`${MARKS_API_ENDPOINTS.TESTDETAILS}`);
  return response.data;
};

export const deleteTest = async (testId) => {
  const response = await axiosInstance.delete(`${MARKS_API_ENDPOINTS.TESTDETAILS}${testId}/`);
  return response.data;
};

export const updateTest = async (testId, updatedData) => {
  const response = await axiosInstance.put(`${MARKS_API_ENDPOINTS.TESTDETAILS}${testId}/`, updatedData);
  return response.data;
};
