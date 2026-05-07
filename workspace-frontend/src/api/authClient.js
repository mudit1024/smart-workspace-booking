import axios from "axios"
import { toast } from "sonner"

const authClient = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL,
  headers: {
    "Content-Type": "application/json"
  }
})

// ================= REQUEST INTERCEPTOR =================

authClient.interceptors.request.use(

  (config) => {

    const token = localStorage.getItem("token")

    // Don't attach token for auth endpoints
    if (
      token &&
      !config.url.includes("/auth/login") &&
      !config.url.includes("/auth/register") &&
      !config.url.includes("/auth/refresh")
    ) {

      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },

  (error) => Promise.reject(error)
)

// ================= RESPONSE INTERCEPTOR =================

authClient.interceptors.response.use(

  // SUCCESS
  (response) => response,

  // ERROR
  (error) => {

    const data = error.response?.data

    // VALIDATION ERRORS
    if (data?.messages) {

     Object.entries(data.messages).forEach(([field, msg]) => {

  const formattedField =
    field.charAt(0).toUpperCase() + field.slice(1)

  toast.error(`${formattedField}: ${msg}`)
})
    }

    // NORMAL BACKEND MESSAGE
    else if (data?.message) {

      toast.error(data.message)
    }

    // STRING ERROR
    else if (typeof data === "string") {

      toast.error(data)
    }

    // UNAUTHORIZED
    else if (error.response?.status === 401) {

      toast.error("Session expired. Please login again.")

      localStorage.removeItem("token")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("user")

      window.location.href = "/"
    }

    // FALLBACK
    else {

      toast.error("Something went wrong")
    }

    return Promise.reject(error)
  }
)

export default authClient