import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"
import AuthLayout from "../components/AuthLayout"
import { loginUser } from "../api/authService"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const data = await loginUser(email, password)

      // token
      localStorage.setItem("token", data.accessToken)
      localStorage.setItem("refreshToken", data.refreshToken)

      // 👤 user info
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.userId,
          name: data.name,
          email: data.email
        })
      )

      toast.success("Login successful")

      navigate("/dashboard")

    } catch (error) {
      console.error(error)
      toast.error("Login failed")
    }
  }

  return (
    <AuthLayout>

      <Card className="w-[420px] bg-white/5 backdrop-blur-xl border border-white/10 text-white shadow-2xl">

        <CardHeader>
          <CardTitle className="text-center text-2xl font-light tracking-wide">
            Smart Workspace
          </CardTitle>

          <p className="text-center text-sm text-gray-400">
            Access your workspace dashboard
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">

            <div className="space-y-2">
              <Label>Email</Label>

              <Input
                className="bg-white/5 border-white/10 focus:border-purple-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>

              <Input
                type="password"
                className="bg-white/5 border-white/10 focus:border-purple-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <motion.div whileHover={{ scale: 1.02 }}>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 transition-all">
                Sign In
              </Button>
            </motion.div>

            <p className="text-center text-sm text-gray-400 mt-4">
              New here?{" "}
              <Link to="/register" className="text-blue-400">
                Create account
              </Link>
            </p>

          </form>
        </CardContent>

      </Card>

    </AuthLayout>
  )
}