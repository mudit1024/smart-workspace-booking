import workspaceClient from "./workspaceClient"

export const bookWorkspace = async (data) => {
  const response = await workspaceClient.post("/bookings", data)
  return response.data
}
export const getMyBookings = async () => {
    const response = await workspaceClient.get("/bookings/my")
    return response.data
}

