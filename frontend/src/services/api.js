import axios from "axios";

// Use Render backend URL from .env
// const API_BASE_URL = process.env.REACT_APP_API_URL;

const API_BASE_URL = import.meta.env.VITE_API_URL; 

const api = axios.create({
  baseURL: "https://billing-project-1-edh5.onrender.com/api/",
});

// ✅ Attach Access Token Automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: auto logout if token expired
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized. Please login again.");
    }
    return Promise.reject(error);
  }
);



// export const fetchInvoices = async () => {
//   const res = await fetch(`${API_BASE_URL}/invoices/`, {
//     method: 'GET',
//     headers: { 'Content-Type': 'application/json' },
//   });
//   return res.json();
// };

export default api;

// Example API function
export const fetchInvoices = async () => {
  const res = await api.get("/invoices/"); // automatically calls Render URL + /invoices/
  return res.data;
};