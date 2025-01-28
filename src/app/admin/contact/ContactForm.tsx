'use client'

import { useState, useEffect } from 'react'
import { FiX } from 'react-icons/fi'

interface Contact {
  _id: string
  title: string
  description: string
  email: string
  socialLinks: {
    github?: string
    linkedin?: string
    twitter?: string
    dribbble?: string
  }
  formspreeEndpoint: string
}

interface Props {
  contact: Contact | null
  onClose: () => void
  onSubmit: () => void
}

export default function ContactForm({ contact, onClose, onSubmit }: Props) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    email: '',
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: '',
      dribbble: '',
    },
    formspreeEndpoint: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (contact) {
      setFormData({
        title: contact.title,
        description: contact.description,
        email: contact.email,
        socialLinks: {
          github: contact.socialLinks.github || '',
          linkedin: contact.socialLinks.linkedin || '',
          twitter: contact.socialLinks.twitter || '',
          dribbble: contact.socialLinks.dribbble || '',
        },
        formspreeEndpoint: contact.formspreeEndpoint,
      })
    }
  }, [contact])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSocialLinkChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    platform: string
  ) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: e.target.value,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = contact ? `/api/contact/${contact._id}` : '/api/contact'
      const method = contact ? 'PUT' : 'POST'

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
      console.error('Error submitting contact:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-black border border-white/10 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {contact ? 'Edit' : 'Add'} Contact
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
            <label className="block text-sm font-medium text-white mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-white focus:border-white/20 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Social Links
            </label>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">GitHub</label>
                <input
                  type="url"
                  value={formData.socialLinks.github}
                  onChange={e => handleSocialLinkChange(e, 'github')}
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
                  onChange={e => handleSocialLinkChange(e, 'linkedin')}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-white focus:border-white/20 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Twitter
                </label>
                <input
                  type="url"
                  value={formData.socialLinks.twitter}
                  onChange={e => handleSocialLinkChange(e, 'twitter')}
                  placeholder="https://twitter.com/username"
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
                  onChange={e => handleSocialLinkChange(e, 'dribbble')}
                  placeholder="https://dribbble.com/username"
                  className="w-full px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-white focus:border-white/20 transition-colors"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Formspree Endpoint
            </label>
            <input
              type="url"
              name="formspreeEndpoint"
              value={formData.formspreeEndpoint}
              onChange={handleChange}
              required
              placeholder="https://formspree.io/f/your-form-id"
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
              {contact ? 'Save Changes' : 'Add Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 