import axios from "axios";

const BASE_URL = "http://localhost:8000/marks/subjects/";

export const getSubjects = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const addSubject = async (subject) => {
  return await axios.post(BASE_URL, subject);
};

export const updateSubject = async (id, subject) => {
  return await axios.put(`${BASE_URL}${id}/`, subject);
};

export const deleteSubject = async (id) => {
  return await axios.delete(`${BASE_URL}${id}/`);
};
