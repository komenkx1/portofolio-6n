"use client"

import type React from "react"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { signOut, user } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <header className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold">Portfolio Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </SidebarProvider>
  )
}
