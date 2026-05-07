import axios from "axios"
import { toast } from "sonner"
import { refreshAccessToken } from "./authService"

const workspaceClient = axios.create({
  baseURL: import.meta.env.VITE_WORKSPACE_API_URL,
  headers: {
    "Content-Type": "application/json"
  }
})

// ================= REQUEST INTERCEPTOR =================

workspaceClient.interceptors.request.use(

  (config) => {

    const token = localStorage.getItem("token")

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },

  (error) => Promise.reject(error)
)

// ================= TOKEN REFRESH LOGIC =================

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

// ================= RESPONSE INTERCEPTOR =================

workspaceClient.interceptors.response.use(

  // SUCCESS
  (response) => response,

  // ERROR
  async (error) => {

    const originalRequest = error.config
    const data = error.response?.data

    // ====================================================
    // HANDLE NON-401 ERRORS GLOBALLY
    // ====================================================

    if (error.response?.status !== 401) {

      // Validation errors
      if (data?.messages) {

Object.entries(data.messages).forEach(([field, msg]) => {

  const formattedField =
    field.charAt(0).toUpperCase() + field.slice(1)

  toast.error(`${formattedField}: ${msg}`)
})
      }

      // Standard backend message
      else if (data?.message) {

        toast.error(data.message)
      }

      // String response
      else if (typeof data === "string") {

        toast.error(data)
      }

      // Generic fallback
      else {

        toast.error("Something went wrong")
      }

      return Promise.reject(error)
    }

    // ====================================================
    // TOKEN REFRESH FLOW
    // ====================================================

    // Prevent infinite retry loop
    if (originalRequest._retry) {

      toast.error("Session expired. Please login again.")

      localStorage.clear()

      window.location.href = "/"

      return Promise.reject(error)
    }

    originalRequest._retry = true

    // Queue requests while refreshing
    if (isRefreshing) {

      return new Promise((resolve, reject) => {

        failedQueue.push({ resolve, reject })

      })
        .then(token => {

          originalRequest.headers.Authorization = `Bearer ${token}`

          return workspaceClient(originalRequest)
        })
        .catch(err => Promise.reject(err))
    }

    isRefreshing = true

    try {

      const data = await refreshAccessToken()

      const newToken = data.accessToken

      // Save new tokens
      localStorage.setItem("token", newToken)
      localStorage.setItem("refreshToken", data.refreshToken)

      // Update default headers
      workspaceClient.defaults.headers.common.Authorization =
        `Bearer ${newToken}`

      // Retry queued requests
      processQueue(null, newToken)

      // Retry original request
      originalRequest.headers.Authorization =
        `Bearer ${newToken}`

      return workspaceClient(originalRequest)

    } catch (err) {

      processQueue(err, null)

      toast.error("Session expired. Please login again.")

      localStorage.clear()

      window.location.href = "/"

      return Promise.reject(err)

    } finally {

      isRefreshing = false
    }
  }
)

export default workspaceClient