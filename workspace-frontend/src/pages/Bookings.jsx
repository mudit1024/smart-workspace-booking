import { useEffect, useState } from "react"
import DashboardLayout from "../components/DashboardLayout"
import { getMyBookings } from "../api/bookingService"
import { cancelBooking } from "../api/workspaceService"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

export default function MyBookings() {

  const navigate = useNavigate()

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  // ---------------- FETCH BOOKINGS ----------------
  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const data = await getMyBookings()
      setBookings(data)
    } catch (err) {
      console.error("Failed to fetch bookings", err)
      toast.error("Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }

  // ---------------- HELPERS ----------------

  const formatDateTime = (start, end) => {
    const s = new Date(start)
    const e = new Date(end)

    return `${s.toLocaleDateString("en-GB")} 
        ${s.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false })}
        → 
        ${e.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false })}`
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "REJECTED":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  const handleCancel = async (bookingId) => {
    try {
      await cancelBooking(bookingId)

      toast.success("Booking cancelled")

      // ✅ Update UI instantly (NO RELOAD)
      setBookings(prev =>
        prev.map(b =>
          b.bookingId === bookingId
            ? { ...b, status: "CANCELLED" }
            : b
        )
      )

    } catch (err) {
      console.error("Cancel failed", err)
      toast.error(err.response?.data || "Failed to cancel booking")
    }
  }

  // ---------------- RENDER ----------------

  return (
    <DashboardLayout>
      <h1 className="text-2xl mb-6">My Bookings</h1>

      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="text-gray-400">No bookings yet</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">

          {bookings.map((b, idx) => (
            <div
              key={b.bookingId || idx}
              className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500 transition"
            >
              {/* Workspace Name */}
              <h2
                onClick={() => navigate(`/workspace/${b.workspaceId}`)}
                className="text-lg font-medium cursor-pointer hover:text-purple-400 transition"
              >
                {b.workspaceName || "Workspace"}
                {b.host && <span className="ml-2">👑</span>}
              </h2>

              {/* Time */}
              <p className="text-sm text-gray-400 mt-1">
                {formatDateTime(b.startTime, b.endTime)}
              </p>

              {/* Status Badge */}
              <div className="mt-3 flex items-center gap-2">

                {/* STATUS BADGE */}
                <span
                  className={`px-3 py-1 text-xs rounded-full border ${getStatusStyle(b.status)}`}
                >
                  {b.status}
                </span>

                {/* CANCEL BUTTON */}
                <button
                  onClick={() => handleCancel(b.bookingId)}
                  disabled={b.status === "CANCELLED"}
                  className={`px-3 py-1 text-xs rounded-full border transition
            ${b.status === "CANCELLED"
                      ? "border-gray-500/20 bg-gray-500/10 text-gray-500 cursor-not-allowed"
                      : "border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    }`}
                >
                  Cancel
                </button>

              </div>

              {/* Booking ID (subtle) */}
              <p className="text-[10px] text-gray-500 mt-3">
                ID: {b.bookingId}
              </p>
            </div>
          ))}

        </div>
      )}
    </DashboardLayout>
  )
}