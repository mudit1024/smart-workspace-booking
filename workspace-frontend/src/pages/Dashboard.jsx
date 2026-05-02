import { useEffect, useState } from "react"
import DashboardLayout from "../components/DashboardLayout"
import { getAllWorkspaces } from "../api/workspaceService"

export default function Dashboard() {
  const [workspaces, setWorkspaces] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const data = await getAllWorkspaces()
        setWorkspaces(data)
      } catch (error) {
        console.error("Failed to fetch workspaces", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWorkspaces()
  }, [])

  return (
    <DashboardLayout>
      <h1 className="text-2xl mb-6">Available Workspaces</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {workspaces.map((ws) => (
            <div
              key={ws.id}
              className="p-4 bg-white/5 border border-white/10 rounded-xl"
            >
              <h2 className="text-lg">{ws.name}</h2>
              <p className="text-sm text-gray-400">
                Capacity: {ws.capacity}
              </p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}