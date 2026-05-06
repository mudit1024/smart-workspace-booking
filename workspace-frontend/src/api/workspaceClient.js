import axios from "axios"
import { refreshAccessToken } from "./authService"

const workspaceClient = axios.create({
  baseURL: import.meta.env.VITE_WORKSPACE_API_URL,
})

workspaceClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})


let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })
    failedQueue = []
}

workspaceClient.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config

        // ❌ If not 401 → just reject
        if (error.response?.status !== 401) {
            return Promise.reject(error)
        }

        // ❌ Prevent infinite loop
        if (originalRequest._retry) {
            return Promise.reject(error)
        }

        originalRequest._retry = true

        // 🔁 If already refreshing → queue request
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject })
            })
                .then(token => {
                    originalRequest.headers["Authorization"] = `Bearer ${token}`
                    return workspaceClient(originalRequest)
                })
                .catch(err => Promise.reject(err))
        }

        isRefreshing = true

        try {
            const data = await refreshAccessToken()

            const newToken = data.accessToken

            localStorage.setItem("token", newToken)
            localStorage.setItem("refreshToken", data.refreshToken)

            workspaceClient.defaults.headers.common["Authorization"] = `Bearer ${newToken}`

            processQueue(null, newToken)

            originalRequest.headers["Authorization"] = `Bearer ${newToken}`
            return workspaceClient(originalRequest)

        } catch (err) {
            processQueue(err, null)

            // ❗ Logout user
            localStorage.clear()
            // window.location.href = "/"

            return Promise.reject(err)
        } finally {
            isRefreshing = false
        }
    }
)
export default workspaceClient