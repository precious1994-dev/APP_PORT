'use client'

import { useState, useEffect } from 'react'
import { FiX, FiPlus, FiTrash2 } from 'react-icons/fi'

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

interface Props {
  hero: Hero | null
  onClose: () => void
  onSubmit: () => void
}

export default function HeroForm({ hero, onClose, onSubmit }: Props) {
  const [formData, setFormData] = useState<{
    title: string
    subtitle: string
    description: string
    phrases: string[]
    ctaButtons: { label: string; href: string }[]
    socialLinks: {
      github: string
      linkedin: string
      dribbble: string
    }
  }>({
    title: '',
    subtitle: '',
    description: '',
    phrases: [''],
    ctaButtons: [{ label: '', href: '' }],
    socialLinks: {
      github: '',
      linkedin: '',
      dribbble: '',
    },
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (hero) {
      setFormData({
        title: hero.title || '',
        subtitle: hero.subtitle || '',
        description: hero.description || '',
        phrases: hero.phrases || [''],
        ctaButtons: hero.ctaButtons || [{ label: '', href: '' }],
        socialLinks: {
          github: hero.socialLinks?.github || '',
          linkedin: hero.socialLinks?.linkedin || '',
          dribbble: hero.socialLinks?.dribbble || '',
        },
      })
    }
  }, [hero])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePhraseChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      phrases: prev.phrases.map((phrase, i) => (i === index ? value : phrase)),
    }))
  }

  const addPhrase = () => {
    setFormData(prev => ({
      ...prev,
      phrases: [...prev.phrases, ''],
    }))
  }

  const removePhrase = (index: number) => {
    setFormData(prev => ({
      ...prev,
      phrases: prev.phrases.filter((_, i) => i !== index),
    }))
  }

  const handleButtonChange = (
    index: number,
    field: 'label' | 'href',
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      ctaButtons: prev.ctaButtons.map((button, i) =>
        i === index ? { ...button, [field]: value } : button
      ),
    }))
  }

  const addButton = () => {
    setFormData(prev => ({
      ...prev,
      ctaButtons: [...prev.ctaButtons, { label: '', href: '' }],
    }))
  }

  const removeButton = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ctaButtons: prev.ctaButtons.filter((_, i) => i !== index),
    }))
  }

  const handleSocialLinkChange = (
    platform: 'github' | 'linkedin' | 'dribbble',
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = hero ? `/api/hero/${hero._id}` : '/api/hero'
      const method = hero ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          socialLinks: {
            github: formData.socialLinks.github.trim(),
            linkedin: formData.socialLinks.linkedin.trim(),
            dribbble: formData.socialLinks.dribbble.trim(),
          },
        }),
      })

      if (res.ok) {
        onSubmit()
      }
    } catch (error) {
      console.error('Error submitting hero:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-black border border-white/10 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {hero ? 'Edit' : 'Add'} Hero
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
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-white focus:border-white/20 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Subtitle
            </label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-white focus:border-white/20 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-white focus:border-white/20 transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-white">
                Morphing Phrases
              </label>
              <button
                type="button"
                onClick={addPhrase}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                Add Phrase
              </button>
            </div>
            <div className="space-y-2">
              {formData.phrases.map((phrase, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={phrase}
                    onChange={e => handlePhraseChange(index, e.target.value)}
                    placeholder="Enter phrase"
                    required
                    className="flex-1 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-white focus:border-white/20 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => removePhrase(index)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-white">CTA Buttons</label>
              <button
                type="button"
                onClick={addButton}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                Add Button
              </button>
            </div>
            <div className="space-y-4">
              {formData.ctaButtons.map((button, index) => (
                <div
                  key={index}
                  className="bg-white/[0.03] border border-white/10 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-sm font-medium text-white">
                      Button {index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeButton(index)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Label
                      </label>
                      <input
                        type="text"
                        value={button.label}
                        onChange={e =>
                          handleButtonChange(index, 'label', e.target.value)
                        }
                        placeholder="Button text"
                        required
                        className="w-full px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-white focus:border-white/20 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        URL
                      </label>
                      <input
                        type="url"
                        value={button.href}
                        onChange={e =>
                          handleButtonChange(index, 'href', e.target.value)
                        }
                        placeholder="https://example.com"
                        required
                        className="w-full px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-white focus:border-white/20 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-white">Social Links</label>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  GitHub
                </label>
                <input
                  type="url"
                  value={formData.socialLinks.github}
                  onChange={e => handleSocialLinkChange('github', e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-white focus:border-white/20 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={formData.socialLinks.linkedin}
                  onChange={e => handleSocialLinkChange('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-white focus:border-white/20 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Dribbble
                </label>
                <input
                  type="url"
                  value={formData.socialLinks.dribbble}
                  onChange={e => handleSocialLinkChange('dribbble', e.target.value)}
                  placeholder="https://dribbble.com/username"
                  className="w-full px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-white focus:border-white/20 transition-colors"
                />
              </div>
            </div>
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
              {hero ? 'Save Changes' : 'Add Hero'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 