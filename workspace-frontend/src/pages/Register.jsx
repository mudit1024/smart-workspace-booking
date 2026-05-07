import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"
import AuthLayout from "../components/AuthLayout"
import { registerUser } from "../api/authService"
import { toast } from "sonner"

export default function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleRegister = async (e) => {
    e.preventDefault()

    try {
      const data = await registerUser(name, email, password)

      console.log("Register success:", data)

      toast.success("Account created! Please login.")

    } catch (error) {
      console.error("Register failed:", error)
      toast.error("Registration failed")
    }
  }

  return (
    <AuthLayout>

      <Card className="w-[420px] bg-white/5 backdrop-blur-xl border border-white/10 text-white shadow-2xl">

        <CardHeader>
          <CardTitle className="text-center text-2xl font-light">
            Create Account
          </CardTitle>

          <p className="text-center text-sm text-gray-400">
            Join Smart Workspace System
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">

            <div className="space-y-2">
              <Label>Name</Label>

              <Input
                className="bg-white/5 border-white/10 focus:border-purple-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>

              <Input
                className="bg-white/5 border-white/10 focus:border-purple-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>

              <Input
                type="password"
                className="bg-white/5 border-white/10 focus:border-purple-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 transition-all">
              Sign Up
            </Button>

          </form>

          <p className="text-center text-sm text-gray-400 mt-4">
            Already have an account?{" "}
            <Link to="/" className="text-blue-400">
              Login
            </Link>
          </p>

        </CardContent>

      </Card>

    </AuthLayout>
  )
}