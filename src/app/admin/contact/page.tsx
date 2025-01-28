'use client'

import { useState, useEffect } from 'react'
import { FiEdit2 } from 'react-icons/fi'
import ContactForm from './ContactForm'

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

export default function ContactPage() {
  const [contact, setContact] = useState<Contact | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchContact()
  }, [])

  const fetchContact = async () => {
    try {
      const res = await fetch('/api/contact')
      const data = await res.json()
      setContact(data[0] || null)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching contact:', error)
      setIsLoading(false)
    }
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
  }

  const handleFormSubmit = () => {
    fetchContact()
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
        <h1 className="text-3xl font-bold text-white">Contact</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <FiEdit2 className="w-4 h-4" />
          {contact ? 'Edit' : 'Add'} Contact
        </button>
      </div>

      {contact ? (
        <div className="grid gap-8">
          <div className="bg-white/[0.03] border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Title</h2>
            <p className="text-gray-400">{contact.title}</p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
            <p className="text-gray-400">{contact.description}</p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Email</h2>
            <p className="text-gray-400">{contact.email}</p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Social Links
            </h2>
            <div className="space-y-2">
              {contact.socialLinks.github && (
                <p className="text-gray-400">
                  GitHub: {contact.socialLinks.github}
                </p>
              )}
              {contact.socialLinks.linkedin && (
                <p className="text-gray-400">
                  LinkedIn: {contact.socialLinks.linkedin}
                </p>
              )}
              {contact.socialLinks.twitter && (
                <p className="text-gray-400">
                  Twitter: {contact.socialLinks.twitter}
                </p>
              )}
              {contact.socialLinks.dribbble && (
                <p className="text-gray-400">
                  Dribbble: {contact.socialLinks.dribbble}
                </p>
              )}
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Formspree Endpoint
            </h2>
            <p className="text-gray-400">{contact.formspreeEndpoint}</p>
          </div>
        </div>
      ) : (
        <div className="bg-white/[0.03] border border-white/10 rounded-lg p-6">
          <p className="text-gray-400">No contact information added yet.</p>
        </div>
      )}

      {isFormOpen && (
        <ContactForm
          contact={contact}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  )
} 