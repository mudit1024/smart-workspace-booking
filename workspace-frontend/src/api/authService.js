import authClient from "./authClient"

export const loginUser = async (email, password) => {
  const response = await authClient.post("/auth/login", {
    email,
    password,
  })

  return response.data
}

export const registerUser = async (name, email, password) => {
  const response = await authClient.post("/auth/register", {
    name,
    email,
    password,
  })

  return response.data
}

export const refreshAccessToken = async () => {
  console.log("Asked for refresh...")
  const refreshToken = localStorage.getItem("refreshToken")

  const response = await authClient.post("/auth/refresh", {
    refreshToken
  })

  return response.data
}