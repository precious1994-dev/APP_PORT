'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { FiGithub } from 'react-icons/fi'

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push('/admin/dashboard')
    }
  }, [session, router])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">Welcome Back</h1>
          <p className="mt-2 text-gray-400">Sign in to access the admin dashboard</p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-lg p-8">
          <button
            onClick={() => signIn('github')}
            className="flex items-center justify-center w-full gap-3 px-4 py-3 text-white bg-[#24292F] rounded-lg hover:bg-[#24292F]/90 transition-colors"
          >
            <FiGithub className="w-5 h-5" />
            Sign in with GitHub
          </button>
        </div>
      </div>
    </div>
  )
} 