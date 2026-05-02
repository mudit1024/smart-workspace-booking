import { useNavigate } from "react-router-dom"

export default function Dashboard() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white gap-4">
      <h1 className="text-3xl">Dashboard 🚀</h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  )
}