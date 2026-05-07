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

    return `
      ${s.toLocaleDateString("en-GB")}
      ${s.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      })}
      →
      ${e.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      })}
    `
  }

  const getStatusStyle = (status) => {

    switch (status) {

      case "APPROVED":
        return "bg-green-500/10 text-green-400 border-green-500/20"

      case "PENDING":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"

      case "REJECTED":
        return "bg-red-500/10 text-red-400 border-red-500/20"

      case "CANCELLED":
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"

      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  const handleCancel = async (bookingId) => {

    try {

      await cancelBooking(bookingId)

      toast.success("Booking cancelled")

      // instant UI update
      setBookings(prev =>
        prev.map(b =>
          b.bookingId === bookingId
            ? { ...b, status: "CANCELLED" }
            : b
        )
      )

    } catch (err) {

      console.error("Cancel failed", err)

      toast.error(
        err.response?.data || "Failed to cancel booking"
      )
    }
  }

  // ---------------- RENDER ----------------

  return (

    <DashboardLayout>

      {/* PAGE HEADER */}
      <div className="mb-6">

        <h1 className="text-2xl sm:text-3xl font-semibold">
          My Bookings
        </h1>

      </div>

      {/* LOADING */}
      {loading ? (

        <p>Loading...</p>

      ) : bookings.length === 0 ? (

        <div className="
          p-6
          rounded-2xl
          bg-white/5
          border border-white/10
          text-gray-400
        ">
          No bookings yet
        </div>

      ) : (

        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          2xl:grid-cols-3
          gap-5
        ">

          {bookings.map((b, idx) => (

            <div
              key={b.bookingId || idx}
              className="
                p-5
                rounded-2xl
                bg-white/5
                border border-white/10
                hover:border-purple-500
                transition
                flex flex-col
                justify-between
              "
            >

              {/* TOP SECTION */}
              <div>

                {/* WORKSPACE NAME */}
                <h2
                  onClick={() => navigate(`/workspace/${b.workspaceId}`)}
                  className="
                    text-lg
                    sm:text-xl
                    font-medium
                    cursor-pointer
                    hover:text-purple-400
                    transition
                    break-words
                    flex items-center gap-2
                  "
                >

                  <span className="break-words">
                    {b.workspaceName || "Workspace"}
                  </span>

                  {b.host && (
                    <span className="shrink-0">
                      👑
                    </span>
                  )}

                </h2>

                {/* TIME */}
                <p className="
                  text-sm
                  text-gray-400
                  mt-3
                  leading-relaxed
                  break-words
                ">
                  {formatDateTime(
                    b.startTime,
                    b.endTime
                  )}
                </p>

              </div>

              {/* BOTTOM SECTION */}
              <div className="mt-5">

                {/* STATUS + ACTION */}
                <div className="
                  flex
                  flex-col
                  sm:flex-row
                  sm:items-center
                  gap-3
                ">

                  {/* STATUS BADGE */}
                  <span
                    className={`
                      px-4 py-2
                      text-xs
                      rounded-full
                      border
                      w-fit
                      ${getStatusStyle(b.status)}
                    `}
                  >
                    {b.status}
                  </span>

                  {/* CANCEL BUTTON */}
                  <button
                    onClick={() => handleCancel(b.bookingId)}
                    disabled={b.status === "CANCELLED"}
                    className={`
                      px-4 py-2
                      text-xs
                      rounded-full
                      border
                      transition
                      w-fit

                      ${b.status === "CANCELLED"
                        ? `
                          border-gray-500/20
                          bg-gray-500/10
                          text-gray-500
                          cursor-not-allowed
                        `
                        : `
                          border-red-500/20
                          bg-red-500/10
                          text-red-400
                          hover:bg-red-500/20
                        `
                      }
                    `}
                  >
                    Cancel
                  </button>

                </div>

                {/* BOOKING ID */}
                <p className="
                  text-[11px]
                  text-gray-500
                  mt-4
                  break-all
                ">
                  Booking ID: {b.bookingId}
                </p>

              </div>

            </div>
          ))}

        </div>
      )}

    </DashboardLayout>
  )
}