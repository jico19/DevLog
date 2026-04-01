import axios from "axios";
const BASEURL = import.meta.env.VITE_API_URL

const api = axios.create({
    baseURL: BASEURL,
})

api.interceptors.request.use(config => {
    const token = localStorage.getItem('access_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default api