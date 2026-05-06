import axios from "axios"

const authClient = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL,
})

authClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")

  // ❗ Don't attach token for login/register
  if (
  token &&
  !config.url.includes("/auth/login") &&
  !config.url.includes("/auth/register") &&
  !config.url.includes("/auth/refresh")  
) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default authClient