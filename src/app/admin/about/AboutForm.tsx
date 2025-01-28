'use client'

import { useState, useEffect } from 'react'
import { FiX, FiPlus, FiTrash2, FiUpload } from 'react-icons/fi'

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

interface Props {
  about: About | null
  onClose: () => void
  onSubmit: () => void
}

export default function AboutForm({ about, onClose, onSubmit }: Props) {
  const [formData, setFormData] = useState({
    bio: '',
    shortBio: '',
    skills: [{ category: '', items: [''] }],
    socialLinks: {
      github: '',
      linkedin: '',
      dribbble: '',
      email: '',
    },
    resumeUrl: '',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadError, setUploadError] = useState('')

  useEffect(() => {
    if (about) {
      setFormData({
        bio: about.bio,
        shortBio: about.shortBio,
        skills: about.skills,
        socialLinks: {
          github: about.socialLinks.github || '',
          linkedin: about.socialLinks.linkedin || '',
          dribbble: about.socialLinks.dribbble || '',
          email: about.socialLinks.email || '',
        },
        resumeUrl: about.resumeUrl || '',
      })
    }
  }, [about])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setUploadError('')

    if (file) {
      if (file.type !== 'application/pdf') {
        setUploadError('Please select a PDF file')
        return
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setUploadError('File size should be less than 5MB')
        return
      }
      setSelectedFile(file)
    }
  }

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

  const handleSkillCategoryChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) =>
        i === index ? { ...skill, category: value } : skill
      ),
    }))
  }

  const handleSkillItemChange = (
    categoryIndex: number,
    itemIndex: number,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) =>
        i === categoryIndex
          ? {
              ...skill,
              items: skill.items.map((item, j) =>
                j === itemIndex ? value : item
              ),
            }
          : skill
      ),
    }))
  }

  const addSkillCategory = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, { category: '', items: [''] }],
    }))
  }

  const removeSkillCategory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }))
  }

  const addSkillItem = (categoryIndex: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) =>
        i === categoryIndex
          ? { ...skill, items: [...skill.items, ''] }
          : skill
      ),
    }))
  }

  const removeSkillItem = (categoryIndex: number, itemIndex: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) =>
        i === categoryIndex
          ? {
              ...skill,
              items: skill.items.filter((_, j) => j !== itemIndex),
            }
          : skill
      ),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setUploadError('')

    try {
      let resumeUrl = formData.resumeUrl

      if (selectedFile) {
        const formDataFile = new FormData()
        formDataFile.append('file', selectedFile)

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formDataFile,
        })

        if (!uploadRes.ok) {
          throw new Error('Failed to upload file')
        }

        const { url } = await uploadRes.json()
        resumeUrl = url
      }

      const url = about ? `/api/about/${about._id}` : '/api/about'
      const method = about ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          resumeUrl,
        }),
      })

      if (res.ok) {
        onSubmit()
      }
    } catch (error) {
      console.error('Error submitting about:', error)
      setUploadError('Failed to upload file')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-black border border-white/10 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {about ? 'Edit' : 'Add'} About
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
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-white focus:border-white/20 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Short Bio
            </label>
            <textarea
              name="shortBio"
              value={formData.shortBio}
              onChange={handleChange}
              required
              rows={2}
              className="w-full px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-white focus:border-white/20 transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-white">Skills</label>
              <button
                type="button"
                onClick={addSkillCategory}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                Add Category
              </button>
            </div>
            <div className="space-y-4">
              {formData.skills.map((skill, categoryIndex) => (
                <div
                  key={categoryIndex}
                  className="bg-white/[0.03] border border-white/10 rounded-lg p-4"
                >
                  <div className="flex items-start gap-2 mb-4">
                    <input
                      type="text"
                      value={skill.category}
                      onChange={e =>
                        handleSkillCategoryChange(categoryIndex, e.target.value)
                      }
                      placeholder="Category name"
                      required
                      className="flex-1 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-white focus:border-white/20 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => removeSkillCategory(categoryIndex)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {skill.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={e =>
                            handleSkillItemChange(
                              categoryIndex,
                              itemIndex,
                              e.target.value
                            )
                          }
                          placeholder="Skill name"
                          required
                          className="flex-1 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-white focus:border-white/20 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            removeSkillItem(categoryIndex, itemIndex)
                          }
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addSkillItem(categoryIndex)}
                      className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      <FiPlus className="w-4 h-4" />
                      Add Skill
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.socialLinks.email}
                  onChange={e => handleSocialLinkChange(e, 'email')}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-white focus:border-white/20 transition-colors"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Resume (PDF)
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-white hover:border-white/20 cursor-pointer transition-colors">
                  <FiUpload className="w-4 h-4" />
                  <span>Choose PDF</span>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {selectedFile && (
                  <span className="text-sm text-gray-400">
                    {selectedFile.name}
                  </span>
                )}
              </div>
              {uploadError && (
                <p className="text-sm text-red-500">{uploadError}</p>
              )}
              {formData.resumeUrl && !selectedFile && (
                <p className="text-sm text-gray-400">
                  Current resume: {formData.resumeUrl}
                </p>
              )}
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
              {about ? 'Save Changes' : 'Add About'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 