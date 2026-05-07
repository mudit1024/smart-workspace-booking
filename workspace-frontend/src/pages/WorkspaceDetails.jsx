import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import DashboardLayout from "../components/DashboardLayout"
import {
  getSlots,
  bookWorkspace,
  getParticipants,
  approveBooking,
  rejectBooking
} from "../api/workspaceService"
import { getWorkspaceById } from "../api/workspaceService"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { ChevronLeft } from "lucide-react"

export default function WorkspaceDetails() {

  const navigate = useNavigate()
  const { id } = useParams()

  const [workspace, setWorkspace] = useState(null)
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)

  // booking form state
  const [showForm, setShowForm] = useState(false)
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [openForJoin, setOpenForJoin] = useState(false)

  // filters
  const [showOpenOnly, setShowOpenOnly] = useState(false)
  const [minAvailable, setMinAvailable] = useState(0)

  // participants
  const [participantsMap, setParticipantsMap] = useState({})
  const [loadingParticipants, setLoadingParticipants] = useState({})
  const [openParticipants, setOpenParticipants] = useState({})
  const [joiningSlotId, setJoiningSlotId] = useState(null)

  const currentUser = JSON.parse(localStorage.getItem("user"))

  const isHostForSlot = (slotParticipants) => {
    if (!currentUser || !slotParticipants) return false

    return slotParticipants.some(
      (p) => p.userId === currentUser.id && (p.host || p.isHost)
    )
  }

  // ---------------- FETCH DATA ----------------

  useEffect(() => {
    fetchWorkspace()
    fetchSlots()
  }, [id])

  const fetchWorkspace = async () => {
    try {
      const data = await getWorkspaceById(id)
      setWorkspace(data)
    } catch (error) {
      console.error("Failed to fetch workspace", error)
      toast.error("Failed to load workspace")
    }
  }

  const fetchSlots = async () => {
    try {
      setLoading(true)

      const data = await getSlots(id)

      setSlots(data)

    } catch (err) {
      console.error("Failed to fetch slots", err)
      toast.error("Failed to load slots")
    } finally {
      setLoading(false)
    }
  }

  const toggleParticipants = async (slotId) => {

    // CLOSE if already open
    if (openParticipants[slotId]) {
      setOpenParticipants(prev => ({
        ...prev,
        [slotId]: false
      }))
      return
    }

    // OPEN + FETCH
    try {

      setLoadingParticipants(prev => ({
        ...prev,
        [slotId]: true
      }))

      const data = await getParticipants(slotId)

      setParticipantsMap(prev => ({
        ...prev,
        [slotId]: data
      }))

      setOpenParticipants(prev => ({
        ...prev,
        [slotId]: true
      }))

    } catch (err) {
      toast.error("Failed to load participants")
    } finally {

      setLoadingParticipants(prev => ({
        ...prev,
        [slotId]: false
      }))
    }
  }

  // ---------------- FILTER LOGIC ----------------

  const filteredSlots = slots
    .filter((slot) => {

      const available = slot.capacity - slot.bookedCount

      if (showOpenOnly && !slot.openForJoin) return false
      if (available < minAvailable) return false

      return true
    })
    .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))

  // ---------------- JOIN EXISTING SLOT ----------------

  const handleJoinSlot = async (slot) => {

    try {

      setJoiningSlotId(slot.id)

      await bookWorkspace({
        workspaceId: id,
        startTime: slot.startTime,
        endTime: slot.endTime,
        openForJoin: slot.openForJoin
      })

      toast.success("Slot booked")

      fetchSlots()

      const currentUser = JSON.parse(localStorage.getItem("user"))

      setParticipantsMap(prev => {

        const existing = prev[slot.id] || []

        const alreadyExists = existing.some(
          p => p.userId === currentUser.id
        )

        if (alreadyExists) return prev

        return {
          ...prev,
          [slot.id]: [
            ...existing,
            {
              userId: currentUser.id,
              userName: currentUser.name,
              status: slot.openForJoin ? "APPROVED" : "PENDING",
              isHost: false
            }
          ]
        }
      })

    } catch (err) {

      const error = err.response?.data

      switch (error?.error) {

        case "ALREADY_BOOKED":
          toast.error("You already booked this slot")
          break

        case "SLOT_FULL":
          toast.error("This slot is full")
          break

        case "WORKSPACE_NOT_FOUND":
          toast.error("Workspace not found")
          break

        default:
          toast.error(error?.message || "Something went wrong")
      }

    } finally {
      setJoiningSlotId(null)
    }
  }

  // ---------------- CREATE NEW SLOT ----------------

  const handleCreateSlot = async () => {

    try {

      const start = new Date(startTime)
      const end = new Date(endTime)
      const now = new Date()

      // Start must be future
      if (start <= now) {
        toast.error("Start time must be in the future")
        return
      }

      // End after start
      if (end <= start) {
        toast.error("End time must be after start time")
        return
      }

      // 48 hour limit
      const maxTime = new Date(now.getTime() + 48 * 60 * 60 * 1000)

      if (start > maxTime) {
        toast.error("Start time must be within next 48 hours")
        return
      }

      // Duration limit
      const durationInHours = (end - start) / (1000 * 60 * 60)

      if (durationInHours > 8) {
        toast.error("Slot duration cannot exceed 8 hours")
        return
      }

      // Overlap check
      const overlappingSlot = slots.find(slot => {
        return (
          start < new Date(slot.endTime) &&
          end > new Date(slot.startTime)
        )
      })

      if (overlappingSlot) {
        toast.error("Slot already exists in this time range")
        return
      }

      const payload = {
        workspaceId: id,
        startTime,
        endTime,
        openForJoin
      }

      await bookWorkspace(payload)

      toast.success("Slot created & booked")

      setShowForm(false)

      fetchSlots()

    } catch (err) {

      const error = err.response?.data

      switch (error?.error) {

        case "ALREADY_BOOKED":
          toast.error("You already booked this slot")
          break

        case "SLOT_FULL":
          toast.error("This slot is full")
          break

        case "WORKSPACE_NOT_FOUND":
          toast.error("Workspace not found")
          break

        default:
          toast.error(error?.message || "Something went wrong")
      }
    }
  }

  const handleApprove = async (p, slotId) => {

    try {

      await approveBooking(p.bookingId)

      toast.success("Booking approved")

      setParticipantsMap(prev => ({
        ...prev,
        [slotId]: prev[slotId].map(participant =>
          participant.bookingId === p.bookingId
            ? { ...participant, status: "APPROVED" }
            : participant
        )
      }))

    } catch (err) {
      toast.error(err.response?.data || "Failed to approve")
    }
  }

  const handleReject = async (bookingId, slotId) => {

    try {

      await rejectBooking(bookingId)

      toast.success("Booking rejected")

      setParticipantsMap(prev => ({
        ...prev,
        [slotId]: prev[slotId].map(participant =>
          participant.bookingId === bookingId
            ? { ...participant, status: "REJECTED" }
            : participant
        )
      }))

    } catch (err) {
      toast.error(err.response?.data || "Failed to reject")
    }
  }

  // ---------------- SAFE RENDER ----------------

  if (!workspace) {
    return (
      <DashboardLayout>
        <p className="text-white">Loading workspace...</p>
      </DashboardLayout>
    )
  }

  return (

    <DashboardLayout>

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">

        <button
          onClick={() => window.history.back()}
          className="w-9 h-9 flex items-center justify-center rounded-full
          bg-white/10 hover:bg-white/20 border border-white/10 transition shrink-0"
        >
          <ChevronLeft size={18} />
        </button>

        <h1 className="text-xl sm:text-2xl font-semibold">
          Workspace Slots
        </h1>

      </div>

      {/* WORKSPACE DETAILS */}
      <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">

        <h2 className="text-lg sm:text-xl font-medium break-words">
          {workspace.name}
        </h2>

        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-6 mt-3 text-sm text-gray-400">

          <p className="break-words">
            📍 {workspace.location}
          </p>

          <p>
            👥 Capacity: {workspace.capacity}
          </p>

          <p>
            🏷 Type: {workspace.type}
          </p>

        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">

          {/* OPEN SLOT TOGGLE */}
          <div className="flex flex-col">

            <label className="text-xs text-gray-400 mb-1">
              Open Slots
            </label>

            <button
              onClick={() => setShowOpenOnly(prev => !prev)}
              className={`w-[80px] h-[36px] rounded-full relative transition
              ${showOpenOnly ? "bg-purple-600" : "bg-white/10"}`}
            >
              <div
                className={`absolute top-1 left-1 w-[28px] h-[28px] rounded-full bg-white transition
                ${showOpenOnly ? "translate-x-[44px]" : ""}`}
              />
            </button>

          </div>

          {/* MIN AVAILABLE */}
          <div className="flex flex-col">

            <label className="text-xs text-gray-400 mb-1">
              Min Available
            </label>

            <input
              type="number"
              value={minAvailable}
              onChange={(e) => setMinAvailable(Number(e.target.value))}
              className="p-2 rounded bg-white/5 border border-white/10 text-white w-full sm:w-[100px]"
            />

          </div>

        </div>

        {/* CREATE BUTTON */}
        <button
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 rounded"
        >
          + Pick New Slot
        </button>

      </div>

      {/* SLOT LIST */}
      {loading ? (

        <p>Loading slots...</p>

      ) : (

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

          {filteredSlots.map((slot) => {

            const participants = participantsMap[slot.id]

            const alreadyJoined =
              participants?.some(p => p.userId === currentUser?.id) || false

            const isFull = slot.bookedCount >= slot.capacity

            return (

              <div
                key={slot.id}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500 transition"
              >

                {/* TIME */}
                <p className="text-sm text-gray-400 break-words">

                  {new Date(slot.startTime).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false
                  })}

                  {" → "}

                  {new Date(slot.endTime).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false
                  })}

                </p>

                {/* CAPACITY */}
                <p className="text-sm mt-2">
                  👥 {slot.bookedCount}/{slot.capacity}
                </p>

                {/* STATUS */}
                <p className={`text-xs mt-1 ${
                  slot.openForJoin
                    ? "text-green-400"
                    : "text-yellow-400"
                }`}>

                  {slot.openForJoin
                    ? "Open to Join"
                    : "Approval Required"}

                </p>

                {/* VIEW PARTICIPANTS BUTTON */}
                <button
                  onClick={() => toggleParticipants(slot.id)}
                  className="mt-3 w-full bg-gray-700 py-2 rounded text-sm"
                >
                  {loadingParticipants[slot.id]
                    ? "Loading..."
                    : "View Participants"}
                </button>

                {/* PARTICIPANTS LIST */}
                {openParticipants[slot.id] && participantsMap[slot.id] && (

                  <div className="mt-3 text-xs text-gray-300 border-t border-white/10 pt-3">

                    <p className="text-gray-400 mb-2">
                      Participants:
                    </p>

                    {participantsMap[slot.id].length === 0 ? (

                      <p className="text-gray-500">
                        No participants yet
                      </p>

                    ) : (

                      <div className="space-y-3">

                        {participantsMap[slot.id].map((p, idx) => (

                          <div
                            key={idx}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-white/5 p-2 rounded-lg"
                          >

                            <div className="break-words">

                              <span>
                                {p.userName || p.userId}
                                {(p.host || p.host === "true") && " 👑"}
                              </span>

                            </div>

                            <div className="flex flex-wrap items-center gap-2">

                              <span
                                className={
                                  p.isHost
                                    ? "text-green-400"
                                    : p.status === "APPROVED"
                                      ? "text-green-400"
                                      : p.status === "PENDING"
                                        ? "text-yellow-400"
                                        : p.status === "REJECTED"
                                          ? "text-red-400"
                                          : "text-gray-400"
                                }
                              >
                                {p.isHost ? "HOST" : p.status}
                              </span>

                              {isHostForSlot(participantsMap[slot.id]) &&
                                p.status === "PENDING" && (

                                  <div className="flex gap-2">

                                    <button
                                      onClick={() => handleApprove(p, slot.id)}
                                      className="text-xs text-green-400"
                                    >
                                      Approve
                                    </button>

                                    <button
                                      onClick={() => handleReject(p.bookingId, slot.id)}
                                      className="text-xs text-red-400"
                                    >
                                      Reject
                                    </button>

                                  </div>
                                )}

                            </div>

                          </div>
                        ))}

                      </div>
                    )}

                  </div>
                )}

                {/* JOIN BUTTON */}
                <button
                  onClick={async () => {

                    if (!participantsMap[slot.id]) {

                      try {

                        const data = await getParticipants(slot.id)

                        setParticipantsMap(prev => ({
                          ...prev,
                          [slot.id]: data
                        }))

                        const already = data.some(
                          p => p.userId === currentUser?.id
                        )

                        if (already) {
                          toast.info("Already joined")
                          return
                        }

                      } catch {
                        toast.error("Failed to verify slot")
                        return
                      }
                    }

                    handleJoinSlot(slot)
                  }}

                  disabled={
                    joiningSlotId === slot.id ||
                    alreadyJoined ||
                    isFull
                  }

                  className={`mt-3 w-full py-2 rounded text-sm transition
                  ${alreadyJoined || isFull
                    ? "bg-gray-600 cursor-not-allowed"
                    : joiningSlotId === slot.id
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700"
                  }`}
                >

                  {isFull
                    ? "Full"
                    : alreadyJoined
                      ? "Already Joined"
                      : joiningSlotId === slot.id
                        ? "Joining..."
                        : "Join Slot"}

                </button>

              </div>
            )
          })}

        </div>
      )}

      {/* CREATE SLOT MODAL */}
      {showForm && (

        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">

          <div className="w-full max-w-md p-5 sm:p-6 rounded-2xl bg-[#111827] border border-white/10">

            <h2 className="text-lg mb-4 font-medium">
              Create New Slot
            </h2>

            {/* START TIME */}
            <div className="mb-3">

              <label className="text-xs text-gray-400">
                Start Time
              </label>

              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                max={new Date(Date.now() + 48 * 60 * 60 * 1000)
                  .toISOString()
                  .slice(0, 16)}
                className="w-full mt-1 p-2 rounded bg-white/5 border border-white/10 text-white"
              />

            </div>

            {/* END TIME */}
            <div className="mb-3">

              <label className="text-xs text-gray-400">
                End Time
              </label>

              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full mt-1 p-2 rounded bg-white/5 border border-white/10 text-white"
              />

            </div>

            {/* OPEN FOR JOIN */}
            <div className="flex items-start gap-2 mb-4">

              <input
                type="checkbox"
                checked={openForJoin}
                onChange={(e) => setOpenForJoin(e.target.checked)}
                className="mt-1"
              />

              <label className="text-sm text-gray-300">
                Allow others to join instantly
              </label>

            </div>

            {/* ACTIONS */}
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">

              <button
                onClick={() => setShowForm(false)}
                className="w-full sm:w-auto text-gray-400 border border-white/10 rounded px-4 py-2"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateSlot}
                disabled={
                  !startTime ||
                  !endTime ||
                  new Date(endTime) <= new Date(startTime)
                }
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 rounded disabled:opacity-50"
              >
                Book Slot
              </button>

            </div>

          </div>

        </div>
      )}

    </DashboardLayout>
  )
}