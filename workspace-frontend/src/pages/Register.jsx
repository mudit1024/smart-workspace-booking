import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import AuthLayout from "../components/AuthLayout"
import { registerUser } from "../api/authService"
import { toast } from "sonner"

export default function Register() {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  const handleRegister = async (e) => {

    e.preventDefault()

    try {

      const data = await registerUser(
        name,
        email,
        password
      )

      console.log("Register success:", data)

      toast.success("Account created successfully!")

      setTimeout(() => {
        navigate("/")
      }, 1200)

    } catch (error) {

      console.error("Register failed:", error)

      toast.error("Registration failed")
    }
  }

  return (

    <AuthLayout>

      <Card
        className="
          w-full
          max-w-[95vw]
          sm:max-w-[620px]
          md:max-w-[720px]
          lg:max-w-[760px]
          mx-auto
          bg-white/5
          backdrop-blur-xl
          border
          border-white/10
          text-white
          shadow-2xl
          rounded-3xl
        "
      >

        <CardHeader
          className="
            px-5
            sm:px-8
            pt-7
            pb-4
          "
        >

          <CardTitle
            className="
              text-center
              text-2xl
              sm:text-3xl
              font-light
              tracking-wide
              break-words
            "
          >
            Create Account
          </CardTitle>

          <p
            className="
              text-center
              text-sm
              sm:text-base
              text-gray-400
              mt-2
              break-words
            "
          >
            Join Smart Workspace System
          </p>

        </CardHeader>

        <CardContent
          className="
            px-5
            sm:px-8
            pb-7
          "
        >

          <form
            onSubmit={handleRegister}
            className="space-y-5"
          >

            {/* NAME */}
            <div className="space-y-2">

              <Label className="text-sm sm:text-base">
                Name
              </Label>

              <Input
                className="
                  h-12
                  sm:h-13
                  bg-white/5
                  border-white/10
                  focus:border-purple-500
                  text-sm
                  sm:text-base
                  px-4
                "
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
              />

            </div>

            {/* EMAIL */}
            <div className="space-y-2">

              <Label className="text-sm sm:text-base">
                Email
              </Label>

              <Input
                type="email"
                className="
                  h-12
                  sm:h-13
                  bg-white/5
                  border-white/10
                  focus:border-purple-500
                  text-sm
                  sm:text-base
                  px-4
                "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
              />

            </div>

            {/* PASSWORD */}
            <div className="space-y-2">

              <Label className="text-sm sm:text-base">
                Password
              </Label>

              <Input
                type="password"
                className="
                  h-12
                  sm:h-13
                  bg-white/5
                  border-white/10
                  focus:border-purple-500
                  text-sm
                  sm:text-base
                  px-4
                "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />

            </div>

            {/* BUTTON */}
            <Button
              type="submit"
              className="
                w-full
                h-12
                sm:h-13
                mt-2
                text-sm
                sm:text-base
                bg-gradient-to-r
                from-purple-600
                to-blue-600
                hover:opacity-90
                transition-all
                rounded-xl
              "
            >
              Sign Up
            </Button>

          </form>

          {/* LOGIN LINK */}
          <p
            className="
              text-center
              text-sm
              sm:text-base
              text-gray-400
              mt-6
              break-words
            "
          >
            Already have an account?{" "}

            <Link
              to="/"
              className="
                text-blue-400
                hover:text-blue-300
                transition
              "
            >
              Login
            </Link>

          </p>

        </CardContent>

      </Card>

    </AuthLayout>
  )
}