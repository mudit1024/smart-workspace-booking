import axios from "axios"

const axiosClient = axios.create({
  baseURL: "http://localhost:8081",
  headers: {
    "Content-Type": "application/json",
  },
})

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")

  // ❗ DO NOT attach token for auth endpoints
  if (
    token &&
    !config.url.includes("/auth/login") &&
    !config.url.includes("/auth/register")
  ) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default axiosClient