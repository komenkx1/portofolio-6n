"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user && !loading) {
      router.push("/")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return <DashboardLayout>{children}</DashboardLayout>
}
