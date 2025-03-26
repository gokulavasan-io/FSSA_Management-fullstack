import axiosInstance from "./axiosInstance";
import { GENERAL_API_ENDPOINTS } from "./apiPaths";

// Subjects API Function
export const getSubjects = async () => {
  const response = await axiosInstance.get(GENERAL_API_ENDPOINTS.SUBJECTS);
  return response.data;
};

export const addSubject = async (subject) => {
  return await axiosInstance.post(GENERAL_API_ENDPOINTS.SUBJECTS, subject);
};

export const updateSubject = async (id, subject) => {
  return await axiosInstance.put(`${GENERAL_API_ENDPOINTS.SUBJECTS}${id}/`, subject);
};

export const deleteSubject = async (id) => {
  return await axiosInstance.delete(`${GENERAL_API_ENDPOINTS.SUBJECTS}${id}/`);
};


// Batch API Function

export const getBatches = async () => {
  const response = await axiosInstance.get(GENERAL_API_ENDPOINTS.BATCHES);
  return response.data;
};

export const addBatches = async (values) => {
  return await axiosInstance.post(GENERAL_API_ENDPOINTS.BATCHES, values);
};

export const updateBatches = async (id, values) => {
  return await axiosInstance.put(`${GENERAL_API_ENDPOINTS.BATCHES}${id}/`, values);
};

export const deleteBatches = async (id) => {
  return await axiosInstance.delete(`${GENERAL_API_ENDPOINTS.BATCHES}${id}/`);
};
