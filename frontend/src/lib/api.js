import axios from "axios";
const api=axios.create({baseURL:import.meta.env.VITE_API_URL||"http://localhost:3000/api/v1"});
api.interceptors.request.use(config=>{const token=localStorage.getItem("accessToken");if(token)config.headers.Authorization=`Bearer ${token}`;return config});
api.interceptors.response.use(r=>r,e=>{if(e.response?.status===401&&location.pathname!=='/login'){localStorage.removeItem('accessToken');localStorage.removeItem('user')}return Promise.reject(e)});
export default api;
