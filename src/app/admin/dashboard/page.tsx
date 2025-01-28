'use client'

import { useEffect, useState } from 'react'
import { FiBriefcase, FiFolder } from 'react-icons/fi'
import Link from 'next/link'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    experiences: 0,
    projects: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [experiencesRes, projectsRes] = await Promise.all([
          fetch('/api/experiences/count'),
          fetch('/api/projects/count'),
        ])
        
        const [experiences, projects] = await Promise.all([
          experiencesRes.json(),
          projectsRes.json(),
        ])

        setStats({
          experiences: experiences.count,
          projects: projects.count,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    fetchStats()
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Link
          href="/admin/experience"
          className="bg-white/[0.03] border border-white/10 rounded-lg p-6 hover:bg-white/[0.05] transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-lg">
              <FiBriefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Experience</h2>
              <p className="text-gray-400">{stats.experiences} entries</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/projects"
          className="bg-white/[0.03] border border-white/10 rounded-lg p-6 hover:bg-white/[0.05] transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-lg">
              <FiFolder className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Projects</h2>
              <p className="text-gray-400">{stats.projects} entries</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
} 