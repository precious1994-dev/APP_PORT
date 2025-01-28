'use client'

import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { FiHome, FiBriefcase, FiFolder, FiLogOut, FiCode, FiUser, FiLayout, FiMail } from 'react-icons/fi'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: FiHome },
  { name: 'Hero', href: '/admin/hero', icon: FiLayout },
  { name: 'About', href: '/admin/about', icon: FiUser },
  { name: 'Experience', href: '/admin/experience', icon: FiBriefcase },
  { name: 'Projects', href: '/admin/projects', icon: FiFolder },
  { name: 'Skills', href: '/admin/skills', icon: FiCode },
  { name: 'Contact', href: '/admin/contact', icon: FiMail },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'unauthenticated' && pathname !== '/admin') {
      router.push('/admin')
    }
  }, [status, router, pathname])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Don't show the admin layout on the login page
  if (pathname === '/admin') {
    return children
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-white/[0.03] border-r border-white/10">
        <div className="p-6">
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
        </div>
        <nav className="mt-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 text-gray-400 hover:text-white hover:bg-white/[0.03] transition-colors ${
                pathname === item.href ? 'text-white bg-white/[0.03]' : ''
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-6 py-3 text-gray-400 hover:text-white hover:bg-white/[0.03] transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
            Sign Out
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  )
} 