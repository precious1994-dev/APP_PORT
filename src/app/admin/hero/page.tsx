'use client'

import { useState, useEffect } from 'react'
import { FiEdit2, FiGithub, FiLinkedin } from 'react-icons/fi'
import { RiDribbbleLine } from 'react-icons/ri'
import HeroForm from './HeroForm'

interface Hero {
  _id: string
  title: string
  subtitle: string
  description: string
  phrases: string[]
  ctaButtons: {
    label: string
    href: string
  }[]
  socialLinks: {
    github: string
    linkedin: string
    dribbble: string
  }
}

export default function HeroPage() {
  const [hero, setHero] = useState<Hero | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchHero()
  }, [])

  const fetchHero = async () => {
    try {
      const res = await fetch('/api/hero')
      const data = await res.json()
      setHero(data[0] || null)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching hero:', error)
      setIsLoading(false)
    }
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
  }

  const handleFormSubmit = () => {
    fetchHero()
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
        <h1 className="text-3xl font-bold text-white">Hero</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <FiEdit2 className="w-4 h-4" />
          {hero ? 'Edit' : 'Add'} Hero
        </button>
      </div>

      {hero ? (
        <div className="grid gap-8">
          <div className="bg-white/[0.03] border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Title</h2>
            <p className="text-gray-400">{hero.title}</p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Subtitle</h2>
            <p className="text-gray-400">{hero.subtitle}</p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
            <p className="text-gray-400">{hero.description}</p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Morphing Phrases
            </h2>
            <div className="flex flex-wrap gap-2">
              {hero.phrases.map((phrase, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white/[0.03] border border-white/10 rounded-full text-gray-400"
                >
                  {phrase}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">CTA Buttons</h2>
            <div className="space-y-4">
              {hero.ctaButtons.map((button, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-gray-400">
                    {button.label} → {button.href}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Social Links</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FiGithub className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400">
                  {hero.socialLinks?.github || 'Not set'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FiLinkedin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400">
                  {hero.socialLinks?.linkedin || 'Not set'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <RiDribbbleLine className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400">
                  {hero.socialLinks?.dribbble || 'Not set'}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white/[0.03] border border-white/10 rounded-lg p-6">
          <p className="text-gray-400">No hero information added yet.</p>
        </div>
      )}

      {isFormOpen && (
        <HeroForm
          hero={hero}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  )
} 