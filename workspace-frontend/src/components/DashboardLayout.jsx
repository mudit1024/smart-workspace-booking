import { useNavigate, useLocation } from "react-router-dom"
import { getUser } from "../utils/user"
import { User } from "lucide-react"

export default function DashboardLayout({ children }) {
  const navigate = useNavigate()

  const location = useLocation()

  const hideUser =
    location.pathname === "/login" ||
    location.pathname === "/register";

  const user = getUser()

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      {!hideUser && (
        <div className="absolute top-4 right-6 flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
          <User size={16} className="text-white" />
          <span className="text-sm text-white">
            {user?.name || "User"}
          </span>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-64 bg-white/5 border-r border-white/10 p-6 flex flex-col justify-between">

        <div>
          <h1 className="text-xl font-light mb-8">Smart Workspace</h1>

          <nav className="space-y-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="block text-left w-full hover:text-purple-400"
            >
              Dashboard
            </button>

            <button
              onClick={() => navigate("/bookings")}
              className="block text-left w-full hover:text-purple-400"
            >
              My Bookings
            </button>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="text-red-400 hover:text-red-600"
        >
          Logout
        </button>

      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {children}
      </div>

    </div>
  )
}