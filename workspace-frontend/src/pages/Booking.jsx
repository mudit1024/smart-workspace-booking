import { useParams } from "react-router-dom"
import { useState } from "react"
import DashboardLayout from "../components/DashboardLayout"
import { bookWorkspace } from "../api/bookingService"

export default function Booking() {
  const { id } = useParams()

  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [loading, setLoading] = useState(false)

  const handleBooking = async () => {
    try {
      setLoading(true)

      await bookWorkspace({
        workspaceId: id,
        date,
        startTime,
        endTime
      })

      alert("Booking successful ✅")

    } catch (error) {
      console.error(error)
      alert("Booking failed ❌ (slot may be taken)")
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl mb-6">Book Workspace</h1>

      <div className="space-y-4 max-w-md">

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 w-full bg-white/5 border border-white/10"
        />

        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="p-2 w-full bg-white/5 border border-white/10"
        />

        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="p-2 w-full bg-white/5 border border-white/10"
        />

        <button
          onClick={handleBooking}
          disabled={loading}
          className="bg-purple-600 px-4 py-2 rounded"
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>

      </div>
    </DashboardLayout>
  )
}