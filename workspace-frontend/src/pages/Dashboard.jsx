import { useEffect, useState } from "react"
import DashboardLayout from "../components/DashboardLayout"
import { getAllWorkspaces } from "../api/workspaceService"
import { createWorkspace } from "../api/workspaceService"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export default function Dashboard() {
  const navigate = useNavigate()

  const [workspaces, setWorkspaces] = useState([])
  const [loading, setLoading] = useState(true)

  const [locationFilter, setLocationFilter] = useState("Bangalore")
  const [allLocations, setAllLocations] = useState([])
  const [loadingLocations, setLoadingLocations] = useState(true)

  // add new workspace
  const [name, setName] = useState("")
  const [capacity, setCapacity] = useState("")
  const [workspaceLocation, setWorkspaceLocation] = useState("")
  const [type, setType] = useState("")

  const [typeFilter, setTypeFilter] = useState("ALL")
  const [showCreateModal, setShowCreateModal] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")

  const uniqueTypes = [
    "ALL",
    ...new Set(workspaces.map(ws => ws.type).filter(Boolean))
  ]

  const filteredWorkspaces = workspaces.filter((ws) => {
    const matchesType =
      typeFilter === "ALL" || ws.type === typeFilter

    const matchesSearch =
      ws.name?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesType && matchesSearch
  })

  useEffect(() => {
    fetchWorkspaces()
  }, [locationFilter])

  const fetchWorkspaces = async () => {
    try {
      const data = await getAllWorkspaces(
        locationFilter === "ALL" ? "" : locationFilter
      )

      setWorkspaces(data)

    } catch (error) {
      console.error(error)
      toast.error("Failed to load workspaces")
    } finally {
      setLoading(false)
    }
  }

  const fetchAllLocations = async () => {
    try {
      const data = await getAllWorkspaces("")

      const uniqueLocations = [
        "ALL",
        ...new Set(data.map(ws => ws.location).filter(Boolean))
      ]

      setAllLocations(uniqueLocations)

      if (!uniqueLocations.includes(locationFilter)) {
        setLocationFilter("ALL")
      }

    } catch (error) {
      console.error("Failed to fetch locations", error)
      toast.error("Failed to load locations")
    } finally {
      setLoadingLocations(false)
    }
  }

  useEffect(() => {
    fetchAllLocations()
  }, [])

  const handleCreateWorkspace = async () => {
    try {
      await createWorkspace({
        name,
        capacity: Number(capacity),
        location: workspaceLocation,
        type,
      })

      toast.success("Workspace created successfully")

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
      toast.error("Failed to create workspace")
    }
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl mb-6">Available Workspaces</h1>

      <div className="flex justify-between items-end mb-6">

        {/* Filters */}
        <div className="flex gap-4 items-end">

          {/* Location */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-400 mb-1">Location</label>

            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className={`
                h-[40px] px-3
                rounded-lg
                bg-white/5 border border-white/10 text-white
                focus:outline-none focus:ring-2 focus:ring-purple-500
                appearance-none
                ${loadingLocations ? "animate-pulse" : ""}
              `}
            >
              {loadingLocations ? (
                <option>Loading...</option>
              ) : (
                allLocations.map((loc) => (
                  <option
                    key={loc}
                    value={loc}
                    className="bg-black text-white"
                  >
                    {loc}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Type */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-400 mb-1">Type</label>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="
                h-[40px] px-3
                rounded-lg
                bg-white/5 border border-white/10 text-white
                focus:outline-none focus:ring-2 focus:ring-purple-500
                appearance-none
              "
            >
              {uniqueTypes.map((t) => (
                <option
                  key={t}
                  value={t}
                  className="bg-black text-white"
                >
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-400 mb-1 opacity-0">
              Search
            </label>

            <input
              type="text"
              placeholder="Search workspace by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                h-[40px] px-4
                rounded-full
                bg-white/5 border border-white/10
                text-white w-[750px]
                focus:outline-none focus:ring-2 focus:ring-purple-500
                placeholder-gray-400
              "
            />
          </div>

          {/* Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="h-[40px] bg-gradient-to-r from-purple-600 to-blue-600 px-4 rounded"
          >
            + Create Workspace
          </button>

        </div>

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

              <button
                onClick={() => navigate(`/workspace/${ws.id}`)}
                className="mt-3 bg-purple-600 px-3 py-1 rounded text-sm"
              >
                View Slots
              </button>
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
                onClick={() => {
                  setShowCreateModal(false)
                }}
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