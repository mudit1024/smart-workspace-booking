import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { getUser } from "../utils/user"
import {
  User,
  Menu,
  X
} from "lucide-react"

export default function DashboardLayout({ children }) {

  const navigate = useNavigate()
  const location = useLocation()

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const hideUser =
    location.pathname === "/login" ||
    location.pathname === "/register"

  const user = getUser()

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  return (

    <div className="min-h-screen bg-black text-white flex overflow-x-hidden">

      {/* MOBILE MENU BUTTON */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white/10 p-2 rounded-lg border border-white/10"
      >
        <Menu size={22} />
      </button>

      {/* USER BADGE */}
      {!hideUser && (
        <div
          className="
            fixed
            top-4
            right-4
            z-40
            flex
            items-center
            gap-2
            bg-white/10
            backdrop-blur-md
            px-3
            py-2
            rounded-full
            border
            border-white/10
            max-w-[70vw]
          "
        >
          <User size={16} className="text-white shrink-0" />

          <span className="text-sm text-white truncate">
            {user?.name || "User"}
          </span>
        </div>
      )}

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed lg:static top-0 left-0 z-50
          h-screen
          w-[260px]
          bg-[#0b0b0b]
          border-r border-white/10
          p-6
          flex flex-col justify-between
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >

        {/* TOP SECTION */}
        <div>

          {/* MOBILE CLOSE BUTTON */}
          <div className="flex items-center justify-between lg:block">

            <h1 className="text-xl font-light mb-8">
              Smart Workspace
            </h1>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X size={22} />
            </button>

          </div>

          {/* NAVIGATION */}
          <nav className="space-y-3">

            <button
              onClick={() => {
                navigate("/dashboard")
                setSidebarOpen(false)
              }}
              className="
                w-full
                text-left
                px-4
                py-3
                rounded-xl
                bg-white/5
                hover:bg-purple-600/20
                transition
                break-words
              "
            >
              Dashboard
            </button>

            <button
              onClick={() => {
                navigate("/bookings")
                setSidebarOpen(false)
              }}
              className="
                w-full
                text-left
                px-4
                py-3
                rounded-xl
                bg-white/5
                hover:bg-purple-600/20
                transition
                break-words
              "
            >
              My Bookings
            </button>

          </nav>

        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="
            w-full
            mt-8
            text-left
            px-4
            py-3
            rounded-xl
            bg-red-500/10
            text-red-400
            hover:bg-red-500/20
            transition
          "
        >
          Logout
        </button>

      </div>

      {/* MAIN CONTENT */}
      <div
        className="
          flex-1
          w-full
          min-w-0
          px-4
          sm:px-6
          lg:px-8
          pt-20
          lg:pt-8
          pb-8
          overflow-x-hidden
        "
      >
        <div className="w-full max-w-full">
          {children}
        </div>
      </div>

    </div>
  )
}