'use client'

import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import ExperienceForm from './ExperienceForm'

interface Experience {
  _id: string
  title: string
  company: string
  location: string
  startDate: string
  endDate?: string
  type: string
  description: string
  tags: string[]
  highlights: string[]
  order: number
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    try {
      const res = await fetch('/api/experiences')
      const data = await res.json()
      setExperiences(data)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching experiences:', error)
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) return

    try {
      const res = await fetch(`/api/experiences/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setExperiences(experiences.filter(exp => exp._id !== id))
      }
    } catch (error) {
      console.error('Error deleting experience:', error)
    }
  }

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingExperience(null)
  }

  const handleFormSubmit = () => {
    fetchExperiences()
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Experience</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Add Experience
        </button>
      </div>

      <div className="space-y-4">
        {experiences.map((experience) => (
          <div
            key={experience._id}
            className="bg-white/[0.03] border border-white/10 rounded-lg p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  {experience.title}
                </h2>
                <p className="text-gray-400 mb-1">{experience.company}</p>
                <p className="text-gray-400 text-sm mb-4">
                  {experience.location} • {experience.type} • {new Date(experience.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {experience.endDate ? new Date(experience.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                </p>
                <p className="text-gray-400 mb-4">{experience.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {experience.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-white/5 rounded-full text-gray-400 text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                  {experience.highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(experience)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(experience._id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <ExperienceForm
          experience={editingExperience}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  )
} 