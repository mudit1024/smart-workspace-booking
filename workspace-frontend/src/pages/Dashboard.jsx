import DashboardLayout from "../components/DashboardLayout"

export default function Dashboard() {
  return (
    <DashboardLayout>

      <h1 className="text-2xl mb-6">Available Workspaces</h1>

      <div className="grid grid-cols-3 gap-6">
        
        {/* Placeholder cards */}
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
          Workspace A
        </div>

        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
          Workspace B
        </div>

        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
          Workspace C
        </div>

      </div>

    </DashboardLayout>
  )
}