import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/issues'; // change this if your base URL is different

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 👈 Important for cookies/session
});

// 🔹 Get all issues
export const getIssues = () => axiosInstance.get('/');

// 🔹 Update an issue
export const updateIssue = (id, updatedData) =>
  axiosInstance.put(`/${id}`, updatedData);

// 🔹 Delete an issue
export const deleteIssue = id =>
  axiosInstance.delete(`/${id}`);
