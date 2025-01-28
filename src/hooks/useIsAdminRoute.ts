'use client'

import { usePathname } from 'next/navigation'

export function useIsAdminRoute() {
  const pathname = usePathname()
  return pathname?.startsWith('/admin') || false
} 