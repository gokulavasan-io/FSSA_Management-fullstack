import axiosInstance from "./axiosInstance";
import { GENERAL_API_ENDPOINTS,ATTENDANCE_API_ENDPOINTS,MEMBER_API_ENDPOINTS, STUDENT_API_ENDPOINTS } from "./apiPaths";

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

export const addBatch = async (values) => {
  return await axiosInstance.post(GENERAL_API_ENDPOINTS.BATCHES, values);
};

export const updateBatch = async (id, values) => {
  return await axiosInstance.put(`${GENERAL_API_ENDPOINTS.BATCHES}${id}/`, values);
};

export const deleteBatch = async (id) => {
  return await axiosInstance.delete(`${GENERAL_API_ENDPOINTS.BATCHES}${id}/`);
};


// Holiday API Function

export const getHolidays = async () => {
  const response = await axiosInstance.get(ATTENDANCE_API_ENDPOINTS.HOLIDAYS_ADMIN);
  return response.data;
};

export const updateHoliday = async (id, values) => {
  return await axiosInstance.put(`${ATTENDANCE_API_ENDPOINTS.HOLIDAYS_ADMIN}${id}/`, values);
};


export const deleteHoliday = async (id) => {
  return await axiosInstance.delete(`${ATTENDANCE_API_ENDPOINTS.HOLIDAYS_ADMIN}${id}/`);
};


//  Role API Functions

export const getRoles = async () => {
  const response = await axiosInstance.get(MEMBER_API_ENDPOINTS.ROLES);
  return response.data;
};

export const addRole = async (values) => {
  return await axiosInstance.post(MEMBER_API_ENDPOINTS.ROLES, values);
};

export const updateRole = async (id, values) => {
  return await axiosInstance.put(`${MEMBER_API_ENDPOINTS.ROLES}${id}/`, values);
};

export const deleteRole = async (id) => {
  return await axiosInstance.delete(`${MEMBER_API_ENDPOINTS.ROLES}${id}/`);
};


//  Member API Functions

export const getMembers = async () => {
  const response = await axiosInstance.get(MEMBER_API_ENDPOINTS.MEMBERS);
  return response.data;
};

export const addMember = async (values) => {
  return await axiosInstance.post(MEMBER_API_ENDPOINTS.MEMBERS, values);
};

export const updateMember = async (id, values) => {
  return await axiosInstance.put(`${MEMBER_API_ENDPOINTS.MEMBERS}${id}/`, values);
};

export const deleteMember = async (id) => {
  return await axiosInstance.delete(`${MEMBER_API_ENDPOINTS.MEMBERS}${id}/`);
};


//  Member API Functions

export const getSections = async () => {
  const response = await axiosInstance.get(GENERAL_API_ENDPOINTS.SECTIONS);
  return response.data;
};

export const addSection = async (values) => {
  return await axiosInstance.post(GENERAL_API_ENDPOINTS.SECTIONS, values);
};

export const updateSection = async (id, values) => {
  return await axiosInstance.put(`${GENERAL_API_ENDPOINTS.SECTIONS}${id}/`, values);
};

export const deleteSection = async (id) => {
  return await axiosInstance.delete(`${GENERAL_API_ENDPOINTS.SECTIONS}${id}/`);
};


//  Student API Functions

export const getChoices = async () => {
  const response = await axiosInstance.get(STUDENT_API_ENDPOINTS.CHOICES);
  return response.data;
};
export const getStudents = async () => {
  const response = await axiosInstance.get(STUDENT_API_ENDPOINTS.STUDENTS);
  return response.data;
};

export const addStudent = async (values) => {
  return await axiosInstance.post(STUDENT_API_ENDPOINTS.STUDENTS, values);
};

export const updateStudent = async (id, values) => {
  return await axiosInstance.put(`${STUDENT_API_ENDPOINTS.STUDENTS}${id}/`, values);
};

export const deleteStudent= async (id) => {
  return await axiosInstance.delete(`${STUDENT_API_ENDPOINTS.STUDENTS}${id}/`);
};

