import workspaceClient from "./workspaceClient"

export const getWorkspaces = async () => {
  const response = await workspaceClient.get("/workspace")

  return response.data
}