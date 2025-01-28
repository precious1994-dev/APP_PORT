'use client'

import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiExternalLink } from 'react-icons/fi'
import ProjectForm from './ProjectForm'

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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()
      setProjects(data)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching projects:', error)
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setProjects(projects.filter(proj => proj._id !== id))
      }
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingProject(null)
  }

  const handleFormSubmit = () => {
    fetchProjects()
    handleFormClose()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Projects</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-1.5 bg-white text-black px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project._id}
            className="bg-white/[0.03] border border-white/10 rounded-lg p-4"
          >
            <div className="relative h-40 mb-3 overflow-hidden rounded-lg">
              <img
                src={project.image}
                alt={project.title}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-lg font-semibold text-white line-clamp-1">
                  {project.title}
                </h2>
                <div className="flex gap-1 ml-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-1.5 text-gray-400 hover:text-white transition-colors"
                  >
                    <FiEdit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-3 line-clamp-2">{project.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-white/5 rounded-full text-gray-400 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-3 text-sm">
                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                  >
                    GitHub <FiExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {project.links.live && (
                  <a
                    href={project.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                  >
                    Live Demo <FiExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <ProjectForm
          project={editingProject}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  )
} 