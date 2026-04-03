import axios from "axios";
const BASEURL = import.meta.env.VITE_API_URL

const api = axios.create({
    baseURL: BASEURL,
})

api.interceptors.request.use(config => {
    const token = localStorage.getItem('access')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    res => res,
    async error => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            const refresh = localStorage.getItem("refresh")

            // No refresh token = not logged in, just reject normally
            if (!refresh) {
                return Promise.reject(error)
            }

            try {
                const res = await axios.post(
                    "http://localhost:8000/get/refresh/token/",
                    { refresh }
                )
                localStorage.setItem("access", res.data.access)
                originalRequest.headers.Authorization = `Bearer ${res.data.access}`
                return api(originalRequest)
            } catch {
                localStorage.clear()
                window.location.href = "/"
            }
        }

        return Promise.reject(error)
    }
)

export default api