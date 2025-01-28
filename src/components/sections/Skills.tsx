'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface Skill {
  _id: string
  name: string
  category: string
  proficiency: number
  yearsOfExperience: number
  description?: string
  icon?: string
  order: number
}

const CATEGORIES = [
  'Frontend Development',
  'UI/UX Design',
  'Tools & Technologies',
]

const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch('/api/skills')
        const data = await res.json()
        // Sort skills by order within each category
        const sortedData = data.sort((a: Skill, b: Skill) => a.order - b.order)
        setSkills(sortedData)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching skills:', error)
        setIsLoading(false)
      }
    }

    fetchSkills()
  }, [])

  // Group skills by category
  const groupedSkills = CATEGORIES.map(category => ({
    title: category,
    skills: skills.filter(skill => skill.category === category)
  }))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <section id="skills" className="min-h-screen flex items-center bg-secondary dark:bg-white py-20">
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12">
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
              className="mb-20"
            >
              <span className="text-gray-400 dark:text-gray-600 text-sm tracking-wider uppercase mb-2 block">SKILLS</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white dark:text-gray-900">
                Expertise
                <span className="block mt-1">Technique</span>
              </h2>
            </motion.div>

            {/* Skills Grid */}
            <div className="grid md:grid-cols-3 gap-16">
              {groupedSkills.map((category, categoryIndex) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.5,
                    delay: categoryIndex * 0.2 
                  }}
                  className="space-y-8"
                >
                  <h3 className="text-white dark:text-gray-900 text-lg font-medium mb-8">
                    {category.title}
                  </h3>

                  <div className="space-y-8">
                    {category.skills.map((skill, index) => (
                      <motion.div
                        key={skill._id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ 
                          duration: 0.5,
                          delay: (categoryIndex * 0.2) + (index * 0.1)
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white dark:text-gray-900 text-base">{skill.name}</span>
                          <span className="text-white dark:text-gray-900 text-sm">{skill.proficiency}%</span>
                        </div>
                        <div className="h-[2px] bg-white/10 dark:bg-gray-900/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.proficiency}%` }}
                            viewport={{ once: true }}
                            transition={{ 
                              duration: 1,
                              delay: (categoryIndex * 0.2) + (index * 0.1)
                            }}
                            className="h-full bg-white dark:bg-gray-900 rounded-full"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Skills 