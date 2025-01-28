'use client'

import { motion } from 'framer-motion'
import { FiMail, FiGithub, FiLinkedin, FiSend } from 'react-icons/fi'
import { RiDribbbleLine } from 'react-icons/ri'
import { useState, useEffect } from 'react'
import emailjs from '@emailjs/browser'
import { IconType } from 'react-icons'

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

interface ContactMethod {
  icon: IconType
  label: string
  value: string
  href: string
}

const Contact = () => {
  const [contact, setContact] = useState<Contact | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null)

  useEffect(() => {
    // Initialize EmailJS
    emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!)

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

    fetchContact()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)
    
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }
      )
      
      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      console.error('Error sending email:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-gray-900 dark:border-white border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!contact) {
    return null // Don't render the section if there's no data
  }

  const contactMethods: ContactMethod[] = [
    {
      icon: FiMail,
      label: 'Email',
      value: contact.email,
      href: `mailto:${contact.email}`
    },
    ...(contact.socialLinks.github ? [{
      icon: FiGithub,
      label: 'GitHub',
      value: contact.socialLinks.github.replace('https://', ''),
      href: contact.socialLinks.github
    }] : []),
    ...(contact.socialLinks.linkedin ? [{
      icon: FiLinkedin,
      label: 'LinkedIn',
      value: contact.socialLinks.linkedin.replace('https://', ''),
      href: contact.socialLinks.linkedin
    }] : []),
    ...(contact.socialLinks.dribbble ? [{
      icon: RiDribbbleLine,
      label: 'Dribbble',
      value: contact.socialLinks.dribbble.replace('https://', ''),
      href: contact.socialLinks.dribbble
    }] : [])
  ]

  return (
    <section id="contact" className="min-h-screen flex items-center bg-secondary dark:bg-white py-20">
      <div className="w-full max-w-[1200px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Section Header */}
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-400 dark:text-gray-600 text-sm tracking-wider uppercase mb-2 block"
            >
              Contact
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-white dark:text-gray-900 mb-6"
            >
              {contact.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-gray-400 dark:text-gray-600 text-lg mb-12"
            >
              {contact.description}
            </motion.p>
          </div>

          <div className="grid md:grid-cols-[1fr,1.5fr] gap-12">
            {/* Contact Methods */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-8"
            >
              {contactMethods.map((method, index) => (
                <motion.a
                  key={method.label}
                  href={method.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-6 p-4 rounded-lg bg-white/[0.03] dark:bg-gray-50 hover:bg-white/[0.05] dark:hover:bg-gray-100 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-white/5 dark:bg-gray-100 flex items-center justify-center group-hover:bg-white/10 dark:group-hover:bg-gray-200 transition-colors">
                    <method.icon className="w-5 h-5 text-gray-400 dark:text-gray-600 group-hover:text-white dark:group-hover:text-gray-900 transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-white dark:text-gray-900 text-lg font-medium mb-1">{method.label}</h3>
                    <p className="text-gray-400 dark:text-gray-600">{method.value}</p>
                  </div>
                </motion.a>
              ))}
            </motion.div>

            {/* Contact Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="text-white dark:text-gray-900 text-sm mb-2 block">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/[0.03] dark:bg-gray-50 border border-white/10 dark:border-gray-200 focus:border-white/20 dark:focus:border-blue-500 text-white dark:text-gray-900 placeholder-gray-400 dark:placeholder-gray-500 outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-white dark:text-gray-900 text-sm mb-2 block">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/[0.03] dark:bg-gray-50 border border-white/10 dark:border-gray-200 focus:border-white/20 dark:focus:border-blue-500 text-white dark:text-gray-900 placeholder-gray-400 dark:placeholder-gray-500 outline-none transition-colors"
                    placeholder="Your email"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="text-white dark:text-gray-900 text-sm mb-2 block">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/[0.03] dark:bg-gray-50 border border-white/10 dark:border-gray-200 focus:border-white/20 dark:focus:border-blue-500 text-white dark:text-gray-900 placeholder-gray-400 dark:placeholder-gray-500 outline-none transition-colors"
                  placeholder="Project inquiry"
                />
              </div>

              <div>
                <label htmlFor="message" className="text-white dark:text-gray-900 text-sm mb-2 block">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg bg-white/[0.03] dark:bg-gray-50 border border-white/10 dark:border-gray-200 focus:border-white/20 dark:focus:border-blue-500 text-white dark:text-gray-900 placeholder-gray-400 dark:placeholder-gray-500 outline-none transition-colors resize-none"
                  placeholder="Your message"
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Send Message
                    <FiSend className="w-4 h-4" />
                  </>
                )}
              </motion.button>

              {submitStatus === 'success' && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-500 text-center mt-4"
                  role="alert"
                >
                  Message sent successfully!
                </motion.p>
              )}
              
              {submitStatus === 'error' && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-center mt-4"
                  role="alert"
                >
                  Failed to send message. Please try again.
                </motion.p>
              )}
            </motion.form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Contact 