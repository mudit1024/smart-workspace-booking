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

      {/* PAGE HEADER */}
      <div className="mb-6">

        <h1 className="text-2xl sm:text-3xl font-semibold break-words">
          Available Workspaces
        </h1>

      </div>

      {/* FILTERS */}
      <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4 mb-8">

        {/* LEFT FILTER SECTION */}
        <div className="flex flex-col lg:flex-row gap-4 w-full">

          {/* LOCATION */}
          <div className="flex flex-col w-full lg:w-[180px]">

            <label className="text-xs text-gray-400 mb-1">
              Location
            </label>

            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className={`
                h-[44px]
                px-3
                rounded-xl
                bg-white/5
                border border-white/10
                text-white
                focus:outline-none
                focus:ring-2
                focus:ring-purple-500
                appearance-none
                w-full
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

          {/* TYPE */}
          <div className="flex flex-col w-full lg:w-[180px]">

            <label className="text-xs text-gray-400 mb-1">
              Type
            </label>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="
                h-[44px]
                px-3
                rounded-xl
                bg-white/5
                border border-white/10
                text-white
                focus:outline-none
                focus:ring-2
                focus:ring-purple-500
                appearance-none
                w-full
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

          {/* SEARCH */}
          <div className="flex flex-col flex-1 min-w-0">

            <label className="text-xs text-gray-400 mb-1 opacity-0">
              Search
            </label>

            <input
              type="text"
              placeholder="Search workspace by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                h-[44px]
                px-4
                rounded-xl
                bg-white/5
                border border-white/10
                text-white
                w-full
                min-w-0
                focus:outline-none
                focus:ring-2
                focus:ring-purple-500
                placeholder-gray-400
              "
            />

          </div>

        </div>

        {/* CREATE BUTTON */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="
            w-full
            sm:w-auto
            h-[44px]
            whitespace-nowrap
            bg-gradient-to-r
            from-purple-600
            to-blue-600
            px-5
            rounded-xl
            hover:opacity-90
            transition
          "
        >
          + Create Workspace
        </button>

      </div>

      {/* WORKSPACE GRID */}
      {loading ? (

        <p>Loading...</p>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">

          {filteredWorkspaces.map((ws) => (

            <div
              key={ws.id}
              className="
                p-5
                bg-white/5
                border border-white/10
                rounded-2xl
                hover:border-purple-500
                transition
                flex flex-col
                justify-between
              "
            >

              <div>

                <h2 className="text-lg sm:text-xl font-medium break-words">
                  {ws.name}
                </h2>

                <div className="mt-3 space-y-2 text-sm text-gray-400">

                  <p className="break-words">
                    📍 {ws.location}
                  </p>

                  <p>
                    👥 Capacity: {ws.capacity}
                  </p>

                  <p className="break-words">
                    🏷 Type: {ws.type}
                  </p>

                </div>

              </div>

              <button
                onClick={() => navigate(`/workspace/${ws.id}`)}
                className="
                  mt-5
                  w-full
                  bg-purple-600
                  hover:bg-purple-700
                  px-4
                  py-2.5
                  rounded-xl
                  text-sm
                  transition
                "
              >
                View Slots
              </button>

            </div>
          ))}

        </div>
      )}

      {/* CREATE MODAL */}
      {showCreateModal && (

        <div className="
          fixed inset-0 z-50
          bg-black/70
          backdrop-blur-sm
          flex items-center justify-center
          p-4
        ">

          <div className="
            w-full max-w-lg
            bg-[#111827]
            border border-white/10
            rounded-2xl
            p-5 sm:p-6
          ">

            <h2 className="mb-5 text-xl font-semibold">
              Create Workspace
            </h2>

            {/* NAME */}
            <input
              placeholder="Workspace Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="
                block mb-3
                p-3
                w-full
                rounded-xl
                bg-white/5
                border border-white/10
                text-white
                focus:outline-none
                focus:ring-2
                focus:ring-purple-500
              "
            />

            {/* CAPACITY */}
            <input
              type="number"
              placeholder="Capacity"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="
                block mb-3
                p-3
                w-full
                rounded-xl
                bg-white/5
                border border-white/10
                text-white
                focus:outline-none
                focus:ring-2
                focus:ring-purple-500
              "
            />

            {/* LOCATION */}
            <input
              placeholder="Location"
              value={workspaceLocation}
              onChange={(e) => setWorkspaceLocation(e.target.value)}
              className="
                block mb-3
                p-3
                w-full
                rounded-xl
                bg-white/5
                border border-white/10
                text-white
                focus:outline-none
                focus:ring-2
                focus:ring-purple-500
              "
            />

            {/* TYPE */}
            <input
              placeholder="Type (MEETING_ROOM / DESK / CABIN)"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="
                block mb-5
                p-3
                w-full
                rounded-xl
                bg-white/5
                border border-white/10
                text-white
                focus:outline-none
                focus:ring-2
                focus:ring-purple-500
              "
            />

            {/* ACTIONS */}
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">

              <button
                onClick={() => setShowCreateModal(false)}
                className="
                  w-full sm:w-auto
                  border border-white/10
                  px-5 py-2.5
                  rounded-xl
                  text-gray-300
                  hover:bg-white/5
                  transition
                "
              >
                Cancel
              </button>

              <button
                onClick={handleCreateWorkspace}
                disabled={!name || !capacity || !workspaceLocation || !type}
                className="
                  w-full sm:w-auto
                  bg-gradient-to-r
                  from-purple-600
                  to-blue-600
                  px-5 py-2.5
                  rounded-xl
                  disabled:opacity-50
                  hover:opacity-90
                  transition
                "
              >
                Create Workspace
              </button>

            </div>

          </div>

        </div>
      )}

    </DashboardLayout>
  )
}