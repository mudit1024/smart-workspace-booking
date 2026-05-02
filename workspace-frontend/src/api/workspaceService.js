import workspaceClient from "./workspaceClient"

export const getAllWorkspaces = async (location) => {
  const response = await workspaceClient.get("/workspace", {
    params: {
      location,
    },
  })

  return response.data
}

export const createWorkspace = async (workspaceData) => {
  const response = await workspaceClient.post("/workspace", workspaceData)
  return response.data
}