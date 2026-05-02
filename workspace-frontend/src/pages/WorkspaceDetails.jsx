import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import DashboardLayout from "../components/DashboardLayout"
import { getSlots, bookWorkspace } from "../api/workspaceService"
import { getWorkspaceById } from "../api/workspaceService"

export default function WorkspaceDetails() {
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
    }
  }

  const fetchSlots = async () => {
    try {
      setLoading(true)
      const data = await getSlots(id)
      setSlots(data)
    } catch (err) {
      console.error("Failed to fetch slots", err)
    } finally {
      setLoading(false)
    }
  }

  // ---------------- FILTER LOGIC ----------------

  const filteredSlots = slots.filter((slot) => {
    const available = slot.capacity - slot.bookedCount

    if (showOpenOnly && !slot.openForJoin) return false
    if (available < minAvailable) return false

    return true
  })

  // ---------------- JOIN EXISTING SLOT ----------------

  const handleJoin = async (slot) => {
    try {
      await bookWorkspace({
        workspaceId: id,
        startTime: slot.startTime,
        endTime: slot.endTime,
        openForJoin: slot.openForJoin,
      })

      alert("Joined slot successfully")
      fetchSlots()
    } catch (err) {
      console.error("Join failed", err)
    }
  }

  // ---------------- CREATE NEW SLOT ----------------

  const handleCreateSlot = async () => {
    try {
      await bookWorkspace({
        workspaceId: id,
        startTime,
        endTime,
        openForJoin,
      })

      alert("Slot created & booked")
      setShowForm(false)

      // reset form
      setStartTime("")
      setEndTime("")
      setOpenForJoin(false)

      fetchSlots()
    } catch (err) {
      console.error("Create slot failed", err)
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
      <h1 className="text-2xl mb-6">Workspace Slots</h1>

      {/* WORKSPACE DETAILS */}
      <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
        <h2 className="text-xl font-medium">{workspace.name}</h2>

        <div className="flex gap-6 mt-2 text-sm text-gray-400">
          <p>📍 {workspace.location}</p>
          <p>👥 Capacity: {workspace.capacity}</p>
          <p>🏷 Type: {workspace.type}</p>
        </div>
      </div>

      {/* FILTERS + ACTION */}
      <div className="flex justify-between items-end mb-6">

        <div className="flex gap-6">

          <div className="flex flex-col">
            <label className="text-xs text-gray-400 mb-1">Open Slots</label>
            <input
              type="checkbox"
              checked={showOpenOnly}
              onChange={(e) => setShowOpenOnly(e.target.checked)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-gray-400 mb-1">Min Available</label>
            <input
              type="number"
              value={minAvailable}
              onChange={(e) => setMinAvailable(Number(e.target.value))}
              className="p-2 rounded bg-white/5 border border-white/10 text-white w-[100px]"
            />
          </div>

        </div>

        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 rounded"
        >
          + Pick New Slot
        </button>
      </div>

      {/* SLOT LIST */}
      {loading ? (
        <p>Loading slots...</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filteredSlots.map((slot) => (
            <div
              key={slot.id}
              className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500 transition"
            >
              <p className="text-sm text-gray-400">
                {new Date(slot.startTime).toLocaleString()} →{" "}
                {new Date(slot.endTime).toLocaleTimeString()}
              </p>

              <p className="text-sm mt-2">
                👥 {slot.bookedCount}/{slot.capacity}
              </p>

              <p
                className={`text-xs mt-1 ${
                  slot.openForJoin
                    ? "text-green-400"
                    : "text-yellow-400"
                }`}
              >
                {slot.openForJoin
                  ? "Open to Join"
                  : "Approval Required"}
              </p>

              <button
                onClick={() => handleJoin(slot)}
                className="mt-3 w-full bg-purple-600 py-1 rounded text-sm"
              >
                Join Slot
              </button>
            </div>
          ))}
        </div>
      )}

      {/* CREATE SLOT MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">

          <div className="w-[420px] p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">

            <h2 className="text-lg mb-4 font-medium">Create New Slot</h2>

            {/* Start Time */}
            <div className="mb-3">
              <label className="text-xs text-gray-400">Start Time</label>
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

            {/* End Time */}
            <div className="mb-3">
              <label className="text-xs text-gray-400">End Time</label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full mt-1 p-2 rounded bg-white/5 border border-white/10 text-white"
              />
            </div>

            {/* Open For Join */}
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={openForJoin}
                onChange={(e) => setOpenForJoin(e.target.checked)}
              />
              <label className="text-sm text-gray-300">
                Allow others to join instantly
              </label>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-between">
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateSlot}
                disabled={!startTime || !endTime}
                className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 rounded disabled:opacity-50"
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