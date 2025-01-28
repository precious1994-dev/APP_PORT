'use client'

import { useState, useEffect } from 'react'
import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi'
import SkillForm from './SkillForm'

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

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const res = await fetch('/api/skills')
      const data = await res.json()
      setSkills(data)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching skills:', error)
      setIsLoading(false)
    }
  }

  const handleEdit = (skill: Skill) => {
    setSelectedSkill(skill)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return

    try {
      const res = await fetch(`/api/skills/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setSkills(skills.filter(skill => skill._id !== id))
      }
    } catch (error) {
      console.error('Error deleting skill:', error)
    }
  }

  const handleFormClose = () => {
    setSelectedSkill(null)
    setIsFormOpen(false)
  }

  const handleFormSubmit = async () => {
    await fetchSkills()
    handleFormClose()
  }

  const groupedSkills = CATEGORIES.map(category => ({
    category,
    skills: skills.filter(skill => skill.category === category)
  }))

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
        <h1 className="text-3xl font-bold text-white">Skills</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Add Skill
        </button>
      </div>

      <div className="space-y-8">
        {groupedSkills.map(({ category, skills }) => (
          <div key={category}>
            <h2 className="text-xl font-semibold text-white mb-4">{category}</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {skills.map((skill) => (
                <div
                  key={skill._id}
                  className="bg-white/[0.03] border border-white/10 rounded-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{skill.name}</h3>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(skill)}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(skill._id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-400">Proficiency</span>
                        <span className="text-sm text-white">{skill.proficiency}%</span>
                      </div>
                      <div className="h-2 bg-white/[0.03] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                    </div>

                    <p className="text-gray-400">
                      {skill.yearsOfExperience} years of experience
                    </p>

                    {skill.description && (
                      <p className="text-gray-400">{skill.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <SkillForm
          skill={selectedSkill}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  )
} 