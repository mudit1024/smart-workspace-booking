import { motion } from "framer-motion"

export default function AuthLayout({ children }) {

  return (

    <div
      className="
        min-h-screen
        relative
        overflow-hidden
        bg-black
        flex
        items-start
        justify-center
        px-4
        sm:px-6
        lg:px-8
        pt-10
        sm:pt-14
        lg:pt-20
        pb-10
      "
    >

      {/* 🌈 BACKGROUND GLOW */}
      <div
        className="
          absolute
          w-[280px]
          h-[280px]
          sm:w-[500px]
          sm:h-[500px]
          bg-purple-600
          blur-[120px]
          opacity-30
          top-[-100px]
          left-[-100px]
        "
      />

      <div
        className="
          absolute
          w-[280px]
          h-[280px]
          sm:w-[500px]
          sm:h-[500px]
          bg-blue-600
          blur-[120px]
          opacity-20
          bottom-[-100px]
          right-[-100px]
        "
      />

      {/* CONTENT */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}

        className="
          relative
          z-10
          w-full
          max-w-[95vw]
          sm:max-w-[650px]
          md:max-w-[720px]
          lg:max-w-[760px]
          flex
          justify-center
        "
      >

        <div className="w-full">
          {children}
        </div>

      </motion.div>

    </div>
  )
}