import axios from "axios";
const API_URL = "http://localhost:3001/api/note";

export const getNotes = (userId) => axios.get(`${API_URL}/${userId}`);
export const addNote = (data) => axios.post(API_URL, data);
export const updateNote = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteNote = (id) => axios.delete(`${API_URL}/${id}`);
export const togglePin = (id) => axios.patch(`${API_URL}/${id}/pin`);
export const login = (data) => axios.post("http://localhost:3001/api/user/login", data);
export const register = (data) => axios.post("http://localhost:3001/api/user/register", data);
