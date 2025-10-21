import axios from "axios";

// ✅ URL หลักของ backend
const API_URL = "http://localhost:3001/api"; 

// ✅ ตัว instance ของ axios
const API = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// ================= AUTH =================
export const register = (data) => API.post("/user/register", data);
export const login = (data) => API.post("/user/login", data);

// ================= TODO =================
export const getTodos = () => API.get("/todos");
export const addTodo = (data) => API.post("/todos", data);
export const updateTodo = (id, data) => API.put(`/todos/${id}`, data);
export const deleteTodo = (id) => API.delete(`/todos/${id}`);
