'use client'

import Navbar from '@/components/ui/Navbar'
import MobileNav from '@/components/ui/MobileNav'
import Footer from '@/components/sections/Footer'
import NextAuthProvider from '@/providers/NextAuthProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { useIsAdminRoute } from '@/hooks/useIsAdminRoute'
import Preloader from '@/components/ui/Preloader'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isAdminRoute = useIsAdminRoute()

  return (
    <NextAuthProvider>
      <ThemeProvider>
        {!isAdminRoute && <Preloader />}
        {!isAdminRoute && (
          <>
            <Navbar />
            <MobileNav />
          </>
        )}
        <main className="min-h-screen pb-16 md:pb-0">
          {children}
        </main>
        {!isAdminRoute && <Footer />}
      </ThemeProvider>
    </NextAuthProvider>
  )
} 