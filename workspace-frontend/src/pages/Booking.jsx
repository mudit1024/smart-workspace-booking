import { useParams } from "react-router-dom"
import { useState } from "react"
import DashboardLayout from "../components/DashboardLayout"
import { bookWorkspace } from "../api/bookingService"
import { toast } from "sonner"

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

      toast.success("Booking successful ✅")

      // reset form
      setDate("")
      setStartTime("")
      setEndTime("")

    } catch (error) {

      console.error(error)

      toast.error(
        "Booking failed ❌ (slot may be taken)"
      )

    } finally {
      setLoading(false)
    }
  }

  return (

    <DashboardLayout>

      {/* PAGE HEADER */}
      <div className="mb-6">

        <h1 className="text-2xl sm:text-3xl font-semibold">
          Book Workspace
        </h1>

        <p className="text-gray-400 mt-2 text-sm sm:text-base">
          Choose your preferred booking date and time
        </p>

      </div>

      {/* BOOKING FORM CARD */}
      <div className="
        w-full
        max-w-2xl
        bg-white/5
        border border-white/10
        rounded-2xl
        p-5 sm:p-7
      ">

        <div className="space-y-5">

          {/* DATE */}
          <div>

            <label className="block text-sm text-gray-400 mb-2">
              Select Date
            </label>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="
                w-full
                p-3
                rounded-xl
                bg-white/5
                border border-white/10
                text-white
                focus:outline-none
                focus:ring-2
                focus:ring-purple-500
              "
            />

          </div>

          {/* START TIME */}
          <div>

            <label className="block text-sm text-gray-400 mb-2">
              Start Time
            </label>

            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="
                w-full
                p-3
                rounded-xl
                bg-white/5
                border border-white/10
                text-white
                focus:outline-none
                focus:ring-2
                focus:ring-purple-500
              "
            />

          </div>

          {/* END TIME */}
          <div>

            <label className="block text-sm text-gray-400 mb-2">
              End Time
            </label>

            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="
                w-full
                p-3
                rounded-xl
                bg-white/5
                border border-white/10
                text-white
                focus:outline-none
                focus:ring-2
                focus:ring-purple-500
              "
            />

          </div>

          {/* BUTTON */}
          <button
            onClick={handleBooking}
            disabled={
              loading ||
              !date ||
              !startTime ||
              !endTime
            }
            className="
              w-full
              bg-gradient-to-r
              from-purple-600
              to-blue-600
              hover:opacity-90
              transition
              px-5
              py-3
              rounded-xl
              disabled:opacity-50
              disabled:cursor-not-allowed
              font-medium
            "
          >

            {loading
              ? "Booking..."
              : "Confirm Booking"}

          </button>

        </div>

      </div>

    </DashboardLayout>
  )
}