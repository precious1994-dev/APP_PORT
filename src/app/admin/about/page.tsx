'use client'

import { useState, useEffect } from 'react'
import { FiEdit2 } from 'react-icons/fi'
import AboutForm from './AboutForm'

interface About {
  _id: string
  bio: string
  shortBio: string
  skills: {
    category: string
    items: string[]
  }[]
  socialLinks: {
    github?: string
    linkedin?: string
    dribbble?: string
    email?: string
  }
  resumeUrl?: string
}

export default function AboutPage() {
  const [about, setAbout] = useState<About | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAbout()
  }, [])

  const fetchAbout = async () => {
    try {
      const res = await fetch('/api/about')
      const data = await res.json()
      setAbout(data[0] || null)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching about:', error)
      setIsLoading(false)
    }
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
  }

  const handleFormSubmit = () => {
    fetchAbout()
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
        <h1 className="text-3xl font-bold text-white">About</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <FiEdit2 className="w-4 h-4" />
          {about ? 'Edit' : 'Add'} About
        </button>
      </div>

      {about ? (
        <div className="space-y-6">
          <div className="bg-white/[0.03] border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Bio</h2>
            <p className="text-gray-400 whitespace-pre-wrap">{about.bio}</p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Short Bio</h2>
            <p className="text-gray-400">{about.shortBio}</p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Skills</h2>
            <div className="space-y-6">
              {about.skills.map((skill, index) => (
                <div key={index}>
                  <h3 className="text-lg font-medium text-white mb-2">
                    {skill.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skill.items.map((item, itemIndex) => (
                      <span
                        key={itemIndex}
                        className="px-3 py-1 bg-white/[0.03] border border-white/10 rounded-full text-gray-400"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Social Links</h2>
            <div className="space-y-2">
              {about.socialLinks.github && (
                <p className="text-gray-400">
                  GitHub: {about.socialLinks.github}
                </p>
              )}
              {about.socialLinks.linkedin && (
                <p className="text-gray-400">
                  LinkedIn: {about.socialLinks.linkedin}
                </p>
              )}
              {about.socialLinks.dribbble && (
                <p className="text-gray-400">
                  Dribbble: {about.socialLinks.dribbble}
                </p>
              )}
              {about.socialLinks.email && (
                <p className="text-gray-400">
                  Email: {about.socialLinks.email}
                </p>
              )}
            </div>
          </div>

          {about.resumeUrl && (
            <div className="bg-white/[0.03] border border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Resume</h2>
              <p className="text-gray-400">URL: {about.resumeUrl}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white/[0.03] border border-white/10 rounded-lg p-6">
          <p className="text-gray-400">No about information added yet.</p>
        </div>
      )}

      {isFormOpen && (
        <AboutForm
          about={about}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  )
} 