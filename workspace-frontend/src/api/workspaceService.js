import workspaceClient from "./workspaceClient"

export const getAllWorkspaces = async () => {
  const response = await workspaceClient.get("/workspace")
  return response.data
}