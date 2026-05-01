import { motion } from "framer-motion"

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">

      {/* 🌈 Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-purple-600 blur-[120px] opacity-30 top-[-100px] left-[-100px]" />
      <div className="absolute w-[500px] h-[500px] bg-blue-600 blur-[120px] opacity-20 bottom-[-100px] right-[-100px]" />

      {/* 🧊 Animated Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {children}
      </motion.div>

    </div>
  )
}