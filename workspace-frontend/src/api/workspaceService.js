import workspaceClient from "./workspaceClient"

/**
 * Fetch all workspaces (with optional location filter)
 */
export const getAllWorkspaces = async (location) => {
  const res = await workspaceClient.get("/workspace", {
    params: { location },
  })
  return res.data
}

/**
 * Create new workspace
 */
export const createWorkspace = async (payload) => {
  const res = await workspaceClient.post("/workspace", payload)
  return res.data
}

/**
 * ✅ Fetch slots for a workspace
 */
export const getSlots = async (workspaceId) => {
  console.log("Calling slots API with:", workspaceId)

  const res = await workspaceClient.get(
    `/workspace/${workspaceId}/slots`
  )

  return res.data
}

/**
 * ✅ Book workspace (creates OR joins slot)
 */
export const bookWorkspace = async (payload) => {
  const res = await workspaceClient.post("/workspace/book", payload)
  return res.data
}

export const getWorkspaceById = async (id) => {
  const response = await workspaceClient.get(`/workspace/${id}`)
  return response.data
}

export const getParticipants = async (slotId) => {
  const res = await workspaceClient.get(
    `/workspace/slot/${slotId}/participants`
  )
  return res.data
}

export const approveBooking = async (bookingId) => {
  console.log("Calling approve API with:", bookingId);
    const res = await workspaceClient.post(
        `/workspace/booking/${bookingId}/approve`
    )
    return res.data
}

export const rejectBooking = async (bookingId) => {
    const res = await workspaceClient.post(
        `/workspace/booking/${bookingId}/reject`
    )
    return res.data
}