'use client'

import { motion } from 'framer-motion'
import { FiArrowUpRight } from 'react-icons/fi'
import { useState, useEffect } from 'react'

interface Experience {
  _id: string
  company: string
  position: string
  location: string
  type: string
  startDate: string
  endDate?: string
  description: string
  tags: string[]
  highlights: string[]
  url?: string
  order: number
}

const Experience = () => {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [resumeUrl, setResumeUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await fetch('/api/experiences')
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        const data = await res.json()
        console.log('Fetched experiences:', data)
        
        if (!Array.isArray(data)) {
          throw new Error('Data is not an array')
        }
        
        // Sort experiences by order
        const sortedData = data.sort((a: Experience, b: Experience) => a.order - b.order)
        setExperiences(sortedData)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching experiences:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch experiences')
        setIsLoading(false)
      }
    }

    const fetchResumeUrl = async () => {
      try {
        const res = await fetch('/api/about')
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        const data = await res.json()
        setResumeUrl(data[0]?.resumeUrl || null)
      } catch (error) {
        console.error('Error fetching resume URL:', error)
      }
    }

    fetchExperiences()
    fetchResumeUrl()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-red-500">Error: {error}</p>
      </div>
    )
  }

  if (!experiences.length) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-400">No experiences found</p>
      </div>
    )
  }

  return (
    <section id="experience" className="min-h-screen flex items-center bg-secondary dark:bg-white py-20">
      <div className="w-full max-w-[1200px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12">
            <div>
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-gray-400 dark:text-gray-600 text-sm tracking-wider uppercase mb-2 block"
              >
                Experience
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-white dark:text-gray-900"
              >
                Parcours Professionnel
              </motion.h2>
            </div>
            {resumeUrl && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-4 md:mt-0"
              >
                <a 
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white dark:text-gray-900 hover:text-gray-300 dark:hover:text-gray-600 transition-colors"
                >
                  Voir le CV Complet
                  <FiArrowUpRight className="w-4 h-4" />
                </a>
              </motion.div>
            )}
          </div>

          {/* Experience Cards */}
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="relative bg-white/[0.15] dark:bg-gray-900/[0.15] hover:bg-white/[0.2] dark:hover:bg-gray-900/[0.2] rounded-lg p-6 transition-colors">
                  {/* Company and Date */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <h3 className="text-white dark:text-gray-900 text-xl font-medium">{exp.company}</h3>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-300 dark:text-gray-600 text-sm">
                        {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                      </span>
                      {/* Arrow Icon - Now part of the header */}
                      <div className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-white/10 dark:bg-gray-900/10 group-hover:bg-white/20 dark:group-hover:bg-gray-900/20 transition-colors">
                        <FiArrowUpRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-white dark:group-hover:text-gray-900" />
                      </div>
                    </div>
                  </div>

                  {/* Position */}
                  <h4 className="text-white dark:text-gray-900 text-lg mb-3">{exp.position}</h4>

                  {/* Location and Type */}
                  <div className="flex flex-wrap items-center gap-2 mb-3 text-sm text-gray-300 dark:text-gray-600">
                    <span>{exp.location}</span>
                    <span className="hidden md:inline">•</span>
                    <span>{exp.type}</span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 dark:text-gray-600 text-sm mb-3">
                    {exp.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-2">
                    {exp.tags.map((tag, i) => (
                      <span 
                        key={i}
                        className="px-2 py-0.5 bg-white/20 dark:bg-gray-900/20 rounded-full text-gray-200 dark:text-gray-600 text-xs whitespace-nowrap"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Highlights */}
                  {exp.highlights.length > 0 && (
                    <div className="mt-4">
                      <ul className="list-disc list-inside text-gray-300 dark:text-gray-600 text-sm space-y-1">
                        {exp.highlights.map((highlight, i) => (
                          <li key={i}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 border border-white/20 dark:border-gray-900/20 group-hover:border-white/30 dark:group-hover:border-gray-900/30 rounded-lg transition-colors pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Experience 