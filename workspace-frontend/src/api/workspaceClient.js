import axios from "axios"

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

export default workspaceClient