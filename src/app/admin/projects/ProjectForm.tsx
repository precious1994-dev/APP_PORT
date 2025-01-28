'use client'

import { useState, useEffect } from 'react'
import { FiX, FiPlus, FiTrash, FiUpload } from 'react-icons/fi'
import Image from 'next/image'

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

interface Props {
  project?: Project | null
  onClose: () => void
  onSubmit: () => void
}

export default function ProjectForm({ project, onClose, onSubmit }: Props) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    category: '',
    tags: [''],
    links: {
      github: '',
      live: '',
    },
    order: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [uploadError, setUploadError] = useState<string>('')

  useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        links: {
          github: project.links.github || '',
          live: project.links.live || '',
        },
      })
      setPreviewUrl(project.image)
    }
  }, [project])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    if (name.startsWith('links.')) {
      const linkType = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        links: {
          ...prev.links,
          [linkType]: value,
        },
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleTagChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.map((tag, i) => (i === index ? value : tag)),
    }))
  }

  const addTag = () => {
    setFormData(prev => ({ ...prev, tags: [...prev.tags, ''] }))
  }

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset error
    setUploadError('')

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Only JPG, PNG and WebP images are allowed')
      return
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('File size should be less than 2MB')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to upload image')
      }

      const data = await res.json()
      setFormData(prev => ({ ...prev, image: data.url }))
      setPreviewUrl(data.url)
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to upload image')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = project ? `/api/projects/${project._id}` : '/api/projects'
      const method = project ? 'PUT' : 'POST'

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
      console.error('Error submitting project:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-black border border-white/10 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {project ? 'Edit' : 'Add'} Project
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
              rows={4}
              className="w-full px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-white focus:border-white/20 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Project Image
            </label>
            <div className="space-y-4">
              {previewUrl && (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={previewUrl}
                    alt="Project preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/10 border-dashed rounded-lg cursor-pointer bg-white/[0.03] hover:bg-white/[0.05] transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FiUpload className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">
                      JPG, PNG or WebP (MAX. 2MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              {uploadError && (
                <p className="text-sm text-red-500">{uploadError}</p>
              )}
            </div>
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
              <option value="">Select a category</option>
              <option value="Web Development">Web Development</option>
              <option value="Web Design">Web Design</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Tags
            </label>
            <div className="space-y-2">
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-white focus:border-white/20 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <FiTrash className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addTag}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                Add Tag
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                GitHub URL
              </label>
              <input
                type="url"
                name="links.github"
                value={formData.links.github}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-white focus:border-white/20 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Live Demo URL
              </label>
              <input
                type="url"
                name="links.live"
                value={formData.links.live}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-white focus:border-white/20 transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 