'use client'

import { useState, useEffect } from 'react'
import { FiX } from 'react-icons/fi'

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

interface Props {
  skill: Skill | null
  onClose: () => void
  onSubmit: () => void
}

const CATEGORIES = [
  'Frontend Development',
  'UI/UX Design',
  'Tools & Technologies',
]

export default function SkillForm({ skill, onClose, onSubmit }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    proficiency: 0,
    yearsOfExperience: 0,
    description: '',
    icon: '',
    order: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency,
        yearsOfExperience: skill.yearsOfExperience,
        description: skill.description || '',
        icon: skill.icon || '',
        order: skill.order,
      })
    }
  }, [skill])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'proficiency' || name === 'yearsOfExperience' || name === 'order'
        ? Number(value)
        : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = skill ? `/api/skills/${skill._id}` : '/api/skills'
      const method = skill ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        onSubmit()
      }
    } catch (error) {
      console.error('Error submitting skill:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-black border border-white/10 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {skill ? 'Edit' : 'Add'} Skill
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-white focus:border-white/20 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-white focus:border-white/20 transition-colors"
            >
              <option value="" disabled>Select a category</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Proficiency (%)
            </label>
            <input
              type="number"
              name="proficiency"
              value={formData.proficiency}
              onChange={handleChange}
              required
              min="0"
              max="100"
              className="w-full px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-white focus:border-white/20 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Years of Experience
            </label>
            <input
              type="number"
              name="yearsOfExperience"
              value={formData.yearsOfExperience}
              onChange={handleChange}
              required
              min="0"
              step="0.5"
              className="w-full px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-white focus:border-white/20 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-white focus:border-white/20 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Icon URL (Optional)
            </label>
            <input
              type="url"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-white focus:border-white/20 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Display Order
            </label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-white focus:border-white/20 transition-colors"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : null}
              {skill ? 'Save Changes' : 'Add Skill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 