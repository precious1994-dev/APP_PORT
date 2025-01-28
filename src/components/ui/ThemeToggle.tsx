'use client'

import { useTheme } from 'next-themes'
import { FiSun, FiMoon } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  // Prevent hydration mismatch by not rendering the toggle until mounted
  if (!mounted) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-2 rounded-lg bg-white/[0.03] dark:bg-gray-900/[0.03] border border-white/10 dark:border-gray-900/10 hover:bg-white/[0.06] dark:hover:bg-gray-900/[0.06] transition-colors"
        aria-label="Loading theme toggle"
      >
        <div className="w-5 h-5" />
      </motion.button>
    )
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleToggle}
      className="p-2 rounded-lg bg-white/[0.03] dark:bg-gray-900/[0.03] border border-white/10 dark:border-gray-900/10 hover:bg-white/[0.06] dark:hover:bg-gray-900/[0.06] transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <FiMoon className="w-5 h-5 text-gray-900" />
      ) : (
        <FiSun className="w-5 h-5 text-gray-200" />
      )}
    </motion.button>
  )
} 