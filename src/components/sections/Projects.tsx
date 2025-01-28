'use client'

import { motion } from 'framer-motion'
import { FiGithub, FiExternalLink, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { useState, useEffect } from 'react'

interface Project {
  _id: string
  title: string
  description: string
  image: string
  category: string
  tags: string[]
  links: {
    github?: string
    live?: string
  }
  order: number
}

const ITEMS_PER_PAGE = 6

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<string[]>(['All'])
  const [activeCategory, setActiveCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects')
        const data = await res.json()
        // Sort projects by order
        const sortedData = data.sort((a: Project, b: Project) => a.order - b.order)
        setProjects(sortedData)
        
        // Extract unique categories from projects
        const uniqueCategories = ['All', ...Array.from(new Set<string>(data.map((project: Project) => project.category)))]
        setCategories(uniqueCategories)
        
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching projects:', error)
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const filteredProjects = projects.filter(project => 
    activeCategory === 'All' ? true : project.category === activeCategory
  )

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of projects section smoothly
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  }

  // Reset to first page when category changes
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    setCurrentPage(1)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!projects.length) {
    return null // Don't render the section if there's no data
  }

  return (
    <section id="projects" className="min-h-screen flex items-center bg-secondary dark:bg-white py-20">
      <div className="w-full max-w-[1200px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-gray-400 dark:text-gray-600 text-sm tracking-wider uppercase mb-2 block"
              >
                Projects
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold text-white dark:text-gray-900"
              >
                Projets en Vedette
              </motion.h2>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-4 mb-12">
            {categories.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  activeCategory === category
                    ? 'bg-white dark:bg-gray-900 text-black dark:text-white'
                    : 'text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-gray-900 bg-white/5 dark:bg-gray-900/5'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {paginatedProjects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white/[0.03] dark:bg-gray-900/[0.03] hover:bg-white/[0.05] dark:hover:bg-gray-900/[0.05] rounded-lg overflow-hidden"
              >
                {/* Project Image */}
                <div className="aspect-[16/9] overflow-hidden">
                  <div 
                    className="w-full h-full bg-cover bg-center transform group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url(${project.image})` }}
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <span className="text-gray-400 dark:text-gray-600 text-xs tracking-wider uppercase mb-2 block">
                    {project.category}
                  </span>
                  
                  <h3 className="text-white dark:text-gray-900 text-lg font-medium mb-2">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-400 dark:text-gray-600 text-sm mb-4">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, i) => (
                      <span 
                        key={i}
                        className="px-2 py-0.5 bg-white/5 dark:bg-gray-900/5 rounded-full text-gray-400 dark:text-gray-600 text-xs whitespace-nowrap"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4">
                    {project.links.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-gray-900 transition-colors"
                      >
                        <FiGithub className="w-5 h-5" />
                      </a>
                    )}
                    {project.links.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-gray-900 transition-colors"
                      >
                        <FiExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 border border-white/5 dark:border-gray-900/5 group-hover:border-white/10 dark:group-hover:border-gray-900/10 rounded-lg transition-colors pointer-events-none" />
              </motion.div>
            ))}

            {/* Add empty placeholder cards if less than 3 items */}
            {paginatedProjects.length < 3 && 
              [...Array(3 - paginatedProjects.length)].map((_, i) => (
                <div 
                  key={`empty-${i}`} 
                  className="bg-white/[0.01] dark:bg-gray-900/[0.01] rounded-lg"
                />
              ))
            }
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-full transition-colors ${
                  currentPage === 1
                    ? 'text-gray-600 cursor-not-allowed'
                    : 'text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-gray-900 bg-white/5 dark:bg-gray-900/5'
                }`}
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-8 h-8 rounded-full text-sm transition-colors ${
                    currentPage === i + 1
                      ? 'bg-white dark:bg-gray-900 text-black dark:text-white'
                      : 'text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-gray-900 bg-white/5 dark:bg-gray-900/5'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-full transition-colors ${
                  currentPage === totalPages
                    ? 'text-gray-600 cursor-not-allowed'
                    : 'text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-gray-900 bg-white/5 dark:bg-gray-900/5'
                }`}
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export default Projects 