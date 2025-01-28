'use client'

import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiDribbble, FiMail, FiDownload } from 'react-icons/fi'
import { useState, useEffect } from 'react'

interface SocialLinks {
  github?: string
  linkedin?: string
  twitter?: string
  dribbble?: string
  email?: string
}

interface About {
  _id: string
  bio: string
  shortBio: string
  skills: {
    category: string
    items: string[]
  }[]
  socialLinks: SocialLinks
  resumeUrl?: string
}

const About = () => {
  const [about, setAbout] = useState<About | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch('/api/about')
        const data = await res.json()
        setAbout(data[0] || null) // Get the first about data since we only maintain one record
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching about:', error)
        setIsLoading(false)
      }
    }

    fetchAbout()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!about) {
    return null // Don't render the section if there's no data
  }

  // Filter out social links that don't exist
  const socialLinks = [
    { icon: FiGithub, href: about.socialLinks.github, label: 'GitHub' },
    { icon: FiLinkedin, href: about.socialLinks.linkedin, label: 'LinkedIn' },
    { icon: FiDribbble, href: about.socialLinks.dribbble, label: 'Dribbble' },
    { icon: FiMail, href: `mailto:${about.socialLinks.email}`, label: 'Email' }
  ].filter(link => link.href)

  return (
    <section id="about" className="min-h-screen flex items-center bg-secondary dark:bg-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="relative"
        >
          {/* Subtle background accent */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.03 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="absolute -left-4 top-0 w-1 h-full bg-white dark:bg-gray-900"
          />

          <div className="ml-8">
            {/* Section Title */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <span className="text-gray-400 dark:text-gray-600 text-sm tracking-wider uppercase mb-2 block">About</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white dark:text-gray-900">
                Création d'Expériences
                <span className="block mt-1">Numériques</span>
              </h2>
            </motion.div>

            {/* Main Content */}
            <div className="grid md:grid-cols-12 gap-12">
              {/* Left Column - Main Text */}
              <motion.div 
                className="md:col-span-7 space-y-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="space-y-6">
                  <p className="text-gray-300 dark:text-gray-700 text-lg leading-relaxed">
                    {about.bio}
                  </p>
                  <p className="text-gray-400 dark:text-gray-600 leading-relaxed">
                    {about.shortBio}
                  </p>
                </div>

                {/* Social Links and CV Download */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="pt-4 space-y-8"
                >
                  <div>
                    <h3 className="text-white dark:text-gray-900 text-lg font-medium mb-6 flex items-center gap-2">
                      <span className="h-px w-8 bg-white/20 dark:bg-gray-900/20"/>
                      Connect
                    </h3>
                    <div className="flex items-center gap-6">
                      {socialLinks.map((social) => (
                        <motion.a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-gray-900 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          aria-label={social.label}
                        >
                          <social.icon className="w-5 h-5" />
                        </motion.a>
                      ))}
                    </div>
                  </div>

                  {about.resumeUrl && (
                    <motion.a
                      href={about.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-white dark:text-gray-900 border border-white/10 dark:border-gray-900/10 hover:border-white/40 dark:hover:border-gray-900/40 px-4 py-2 rounded-full transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FiDownload className="w-4 h-4" />
                      <span className="text-sm">Télécharger le CV</span>
                    </motion.a>
                  )}
                </motion.div>
              </motion.div>

              {/* Right Column - Currently Working */}
              <motion.div 
                className="md:col-span-5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="space-y-6">
                  <h3 className="text-white dark:text-gray-900 text-lg font-medium mb-6 flex items-center gap-2">
                    <span className="h-px w-8 bg-white/20 dark:bg-gray-900/20"/>
                    Currently
                  </h3>
                  {about.skills.map((skillCategory, index) => (
                    <div key={skillCategory.category} className="space-y-2">
                      <h4 className="text-white dark:text-gray-900 text-sm font-medium">{skillCategory.category}</h4>
                      <p className="text-gray-400 dark:text-gray-600 leading-relaxed">
                        {skillCategory.items.join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About 