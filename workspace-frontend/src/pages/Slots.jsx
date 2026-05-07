import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import DashboardLayout from "../components/DashboardLayout"
import { getSlots, createSlot } from "../api/slotService"
import { motion } from "framer-motion"
import { toast } from "sonner"

export default function Slots() {

  const { id } = useParams()

  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)

  const [showCreate, setShowCreate] = useState(false)

  // slot creation
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [capacity, setCapacity] = useState("")

  useEffect(() => {
    fetchSlots()
  }, [])

  const fetchSlots = async () => {

    try {

      const data = await getSlots(id)

      setSlots(data)

    } catch (err) {

      console.error(err)
      toast.error("Failed to load slots")

    } finally {
      setLoading(false)
    }
  }

  const handleCreateSlot = async () => {

    try {

      await createSlot({
        workspaceId: id,
        date,
        startTime,
        endTime,
        capacity: Number(capacity)
      })

      toast.success("Slot created successfully")

      fetchSlots()

      setShowCreate(false)

      // reset
      setDate("")
      setStartTime("")
      setEndTime("")
      setCapacity("")

    } catch (err) {

      console.error("Slot create failed", err)

      toast.error("Failed to create slot")
    }
  }

  return (

    <DashboardLayout>

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

        <h1 className="text-2xl font-semibold">
          Available Slots
        </h1>

        <button
          onClick={() => setShowCreate(true)}
          className="
            w-full
            sm:w-auto
            bg-purple-600
            hover:bg-purple-700
            transition
            px-4
            py-3
            rounded-xl
          "
        >
          + Create Slot
        </button>

      </div>

      {/* LOADING */}
      {loading ? (

        <p>Loading...</p>

      ) : slots.length === 0 ? (

        <div
          className="
            p-6
            rounded-2xl
            bg-white/5
            border
            border-white/10
            text-center
            text-gray-400
          "
        >
          No slots available
        </div>

      ) : (

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-4
            lg:gap-6
          "
        >

          {slots.map((slot) => (

            <motion.div
              key={slot.id}
              whileHover={{ scale: 1.02 }}
              className="
                p-5
                bg-white/5
                border
                border-white/10
                rounded-2xl
                backdrop-blur-md
                overflow-hidden
              "
            >

              {/* DATE */}
              <p className="text-lg font-medium break-words">
                {slot.date}
              </p>

              {/* TIME */}
              <p className="mt-2 text-gray-300 break-words">
                {slot.startTime} - {slot.endTime}
              </p>

              {/* CAPACITY */}
              <p className="mt-3 text-sm text-gray-400">
                Available: {slot.availableCapacity}
              </p>

              {/* BUTTON */}
              <button
                className="
                  mt-5
                  w-full
                  bg-green-600
                  hover:bg-green-700
                  transition
                  px-4
                  py-2.5
                  rounded-xl
                  text-sm
                  font-medium
                "
              >
                Book Slot
              </button>

            </motion.div>
          ))}

        </div>
      )}

      {/* MODAL */}
      {showCreate && (

        <div
          className="
            fixed
            inset-0
            z-50
            bg-black/70
            flex
            items-center
            justify-center
            p-4
          "
        >

          <div
            className="
              w-full
              max-w-md
              bg-[#0b0b0b]
              border
              border-white/10
              rounded-2xl
              p-5
              sm:p-6
            "
          >

            <h2 className="mb-5 text-xl font-semibold">
              Create Slot
            </h2>

            {/* DATE */}
            <div className="mb-3">

              <label className="block text-sm text-gray-400 mb-1">
                Date
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
                  border
                  border-white/10
                  text-white
                  outline-none
                "
              />

            </div>

            {/* START TIME */}
            <div className="mb-3">

              <label className="block text-sm text-gray-400 mb-1">
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
                  border
                  border-white/10
                  text-white
                  outline-none
                "
              />

            </div>

            {/* END TIME */}
            <div className="mb-3">

              <label className="block text-sm text-gray-400 mb-1">
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
                  border
                  border-white/10
                  text-white
                  outline-none
                "
              />

            </div>

            {/* CAPACITY */}
            <div className="mb-5">

              <label className="block text-sm text-gray-400 mb-1">
                Capacity
              </label>

              <input
                type="number"
                placeholder="Enter capacity"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="
                  w-full
                  p-3
                  rounded-xl
                  bg-white/5
                  border
                  border-white/10
                  text-white
                  outline-none
                "
              />

            </div>

            {/* ACTIONS */}
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">

              <button
                onClick={() => setShowCreate(false)}
                className="
                  w-full
                  sm:w-auto
                  border
                  border-white/10
                  px-5
                  py-2.5
                  rounded-xl
                  text-gray-300
                  hover:bg-white/5
                  transition
                "
              >
                Cancel
              </button>

              <button
                onClick={handleCreateSlot}
                className="
                  w-full
                  sm:w-auto
                  bg-purple-600
                  hover:bg-purple-700
                  transition
                  px-5
                  py-2.5
                  rounded-xl
                "
              >
                Create
              </button>

            </div>

          </div>

        </div>
      )}

    </DashboardLayout>
  )
}