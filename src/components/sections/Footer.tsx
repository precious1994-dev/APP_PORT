'use client'

import { motion } from 'framer-motion'

const Footer = () => {
  return (
    <footer className="hidden md:block bg-secondary dark:bg-white border-t border-white/5 dark:border-gray-900/5">
      <div className="w-full max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="py-8">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-gray-400 dark:text-gray-600 text-sm text-center"
          >
            Copyright 2025 © Precious Uzoaru - All Right Reserved.
          </motion.p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 