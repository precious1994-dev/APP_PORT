'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiHome, FiUser, FiCode, FiBriefcase, FiFolder, FiMail } from 'react-icons/fi'

const navItems = [
  { name: 'Home', href: '#', icon: FiHome },
  { name: 'About', href: '#about', icon: FiUser },
  { name: 'Skills', href: '#skills', icon: FiCode },
  { name: 'Experience', href: '#experience', icon: FiBriefcase },
  { name: 'Projects', href: '#projects', icon: FiFolder },
  { name: 'Contact', href: '#contact', icon: FiMail },
]

const MobileNav = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsVisible(currentScrollY <= lastScrollY || currentScrollY < 50)
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: isVisible ? 0 : 100 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-0 left-0 right-0 md:hidden bg-secondary/95 dark:bg-white/95 backdrop-blur-sm border-t border-white/10 dark:border-gray-900/10 z-50"
    >
      <div className="flex items-center justify-around h-16 px-4">
        {navItems.map((item) => (
          <motion.a
            key={item.name}
            href={item.href}
            className="flex flex-col items-center gap-1 text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-gray-900"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs">{item.name}</span>
          </motion.a>
        ))}
      </div>
    </motion.nav>
  )
}

export default MobileNav 