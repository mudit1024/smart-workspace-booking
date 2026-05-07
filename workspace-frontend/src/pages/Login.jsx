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

      // user info
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

      <div
        className="
          w-full
          min-h-screen
          flex
          items-start
          justify-center
          px-4
          pt-10
          sm:pt-16
        "
      >

        <Card
  className="
    w-[92vw]
    sm:w-[85vw]
    md:w-[650px]
    lg:w-[720px]
    xl:w-[760px]
    max-w-none
    bg-white/5
    backdrop-blur-xl
    border
    border-white/10
    text-white
    shadow-2xl
  "
>

          <CardHeader className="px-4 sm:px-4 md:px-6 pb-7">

            <CardTitle
              className="
                text-center
                text-2xl
                sm:text-3xl
                font-light
                tracking-wide
              "
            >
              Smart Workspace
            </CardTitle>

            <p className="text-center text-sm text-gray-400 mt-2">
              Access your workspace dashboard
            </p>

          </CardHeader>

          <CardContent className="px-4 sm:px-4 md:px-6 pb-7">

            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

              {/* EMAIL */}
              <div className="space-y-2">

                <Label>Email</Label>

                <Input
                  className="
                    h-11
                    bg-white/5
                    border-white/10
                    focus:border-purple-500
                    text-sm
                    sm:text-base
                  "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                />

              </div>

              {/* PASSWORD */}
              <div className="space-y-2">

                <Label>Password</Label>

                <Input
                  type="password"
                  className="
                    h-11
                    bg-white/5
                    border-white/10
                    focus:border-purple-500
                    text-sm
                    sm:text-base
                  "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />

              </div>

              {/* BUTTON */}
              <motion.div whileHover={{ scale: 1.02 }}>

                <Button
                  className="
                    w-full
                    h-11
                    bg-gradient-to-r
                    from-purple-600
                    to-blue-600
                    hover:opacity-90
                    transition-all
                    text-sm
                    sm:text-base
                  "
                >
                  Sign In
                </Button>

              </motion.div>

              {/* REGISTER */}
              <p
                className="
                  text-center
                  text-sm
                  text-gray-400
                  pt-2
                "
              >
                New here?{" "}

                <Link
                  to="/register"
                  className="text-blue-400"
                >
                  Create account
                </Link>

              </p>

            </form>

          </CardContent>

        </Card>

      </div>

    </AuthLayout>
  )
}