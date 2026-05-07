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

    <div className="min-h-screen bg-black text-white overflow-hidden">

      {/* MOBILE MENU BUTTON */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="
          lg:hidden
          fixed
          top-4
          left-4
          z-50
          bg-white/10
          backdrop-blur-md
          p-2
          rounded-lg
          border
          border-white/10
        "
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
      <aside
        className={`
          fixed
          top-0
          left-0
          z-50
          h-screen
          w-[260px]
          bg-[#0b0b0b]
          border-r
          border-white/10
          p-6
          flex
          flex-col
          justify-between
          transform
          transition-transform
          duration-300
          overflow-hidden

          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >

        {/* TOP SECTION */}
        <div>

          {/* HEADER */}
          <div className="flex items-center justify-between mb-8">

            <h1 className="text-xl font-light">
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
    px-4
    py-3
    rounded-xl
    bg-red-500/10
    text-red-400
    hover:bg-red-500/20
    transition
    flex
    items-center
    justify-center
    text-center
  "
>
  Logout
</button>

      </aside>

      {/* MAIN CONTENT */}
      <main
        className="
          h-screen
          overflow-y-auto
          lg:ml-[260px]
          px-4
          sm:px-6
          lg:px-8
          pt-20
          lg:pt-8
          pb-8
        "
      >
        <div className="w-full max-w-full">
          {children}
        </div>
      </main>

    </div>
  )
}