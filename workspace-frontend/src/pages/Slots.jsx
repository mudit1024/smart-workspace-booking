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

      // reset fields
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
      <h1 className="text-2xl mb-6">Available Slots</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-3 gap-6">

          {slots.map(slot => (
            <motion.div
              key={slot.id}
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer"
            >
              <p>{slot.date}</p>

              <p>
                {slot.startTime} - {slot.endTime}
              </p>

              <p className="text-sm text-gray-400">
                Available: {slot.availableCapacity}
              </p>

              <button className="mt-3 bg-green-600 px-3 py-1 rounded">
                Book Slot
              </button>
            </motion.div>
          ))}

        </div>
      )}

      {/* CREATE SLOT BUTTON */}
      <button
        onClick={() => setShowCreate(true)}
        className="mt-6 bg-purple-600 px-4 py-2 rounded"
      >
        + Create Slot
      </button>

      {/* MODAL */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">

          <div className="bg-black border border-white/10 p-6 rounded-xl w-[400px]">

            <h2 className="mb-4 text-lg">Create Slot</h2>

            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="block mb-2 p-2 w-full bg-white/5 border border-white/10"
            />

            <input
              type="time"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              className="block mb-2 p-2 w-full bg-white/5 border border-white/10"
            />

            <input
              type="time"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
              className="block mb-2 p-2 w-full bg-white/5 border border-white/10"
            />

            <input
              placeholder="Capacity"
              value={capacity}
              onChange={e => setCapacity(e.target.value)}
              className="block mb-4 p-2 w-full bg-white/5 border border-white/10"
            />

            <div className="flex justify-between">

              <button
                onClick={() => setShowCreate(false)}
                className="text-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateSlot}
                className="bg-purple-600 px-4 py-2 rounded"
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