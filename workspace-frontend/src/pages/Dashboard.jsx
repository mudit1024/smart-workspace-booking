import { useEffect, useState } from "react"
import DashboardLayout from "../components/DashboardLayout"
import { getAllWorkspaces } from "../api/workspaceService"
import { createWorkspace } from "../api/workspaceService"

export default function Dashboard() {
  const [workspaces, setWorkspaces] = useState([]);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);

  //add new workspace
  const [name, setName] = useState("")
  const [capacity, setCapacity] = useState("")
  const [workspaceLocation, setWorkspaceLocation] = useState("")
  const [type, setType] = useState("")

  const [typeFilter, setTypeFilter] = useState("ALL")
  const [showCreateModal, setShowCreateModal] = useState(false)

  const uniqueTypes = [
    "ALL",
    ...new Set(workspaces.map(ws => ws.type).filter(Boolean))
  ]
  const filteredWorkspaces =
    typeFilter === "ALL"
      ? workspaces
      : workspaces.filter(ws => ws.type === typeFilter)


  useEffect(() => {
    fetchWorkspaces()
  }, [location])

  const fetchWorkspaces = async () => {
    try {
      setLoading(true)
      const data = await getAllWorkspaces(location)
      setWorkspaces(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateWorkspace = async () => {
    try {
      await createWorkspace({
        name,
        capacity: Number(capacity),
        location: workspaceLocation,
        type,
      })

      // reset fields
      setName("")
      setCapacity("")
      setWorkspaceLocation("")
      setType("")

      // refresh list
      fetchWorkspaces()
      setShowCreateModal(false)

    } catch (error) {
      console.error("Create failed", error)
    }
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl mb-6">Available Workspaces</h1>



      <div className="flex justify-between items-center mb-6">

        {/* Filters */}
        <div className="flex gap-4">

          {/* Location filter (backend) */}
          <input
            type="text"
            placeholder="Filter by location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="p-2 rounded bg-white/5 border border-white/10"
          />

          {/* Type filter (frontend) */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="p-2 rounded bg-white/5 border border-white/10 text-white 
             focus:outline-none focus:ring-2 focus:ring-purple-500
             appearance-none"
          >
            {uniqueTypes.map((t) => (
              <option key={t} value={t} className="bg-black text-white">
                {t}
              </option>
            ))}
          </select>

        </div>

        {/* Create Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 rounded"
        >
          + Create Workspace
        </button>

      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {filteredWorkspaces.map((ws) => (
            <div
              key={ws.id}
              className="p-4 bg-white/5 border border-white/10 rounded-xl"
            >
              <h2 className="text-lg">{ws.name}</h2>
              <p className="text-sm text-gray-400">
                Capacity: {ws.capacity}
              </p>
              <p className="text-sm text-gray-400">
                Type: {ws.type}
              </p>
            </div>
          ))}
        </div>

      )}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">

          <div className="bg-black border border-white/10 p-6 rounded-xl w-[400px]">

            <h2 className="mb-4 text-lg">Create Workspace</h2>

            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block mb-2 p-2 w-full bg-white/5 border border-white/10"
            />

            <input
              placeholder="Capacity"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="block mb-2 p-2 w-full bg-white/5 border border-white/10"
            />

            <input
              placeholder="Location"
              value={workspaceLocation}
              onChange={(e) => setWorkspaceLocation(e.target.value)}
              className="block mb-2 p-2 w-full bg-white/5 border border-white/10"
            />

            <input
              placeholder="Type (e.g. MEETING_ROOM)"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="block mb-4 p-2 w-full bg-white/5 border border-white/10"
            />

            <div className="flex justify-between">

              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateWorkspace}
                disabled={!name || !capacity || !workspaceLocation || !type}
                className="bg-purple-600 px-4 py-2 rounded disabled:opacity-50"
              >
                Create
              </button>

            </div>

          </div>
        </div>
      )}
    </DashboardLayout>
  )
}