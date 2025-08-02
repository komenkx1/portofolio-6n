"use client"

import { User, Briefcase, Code, FolderOpen, GraduationCap, Building, Trophy, Award, Home, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Services",
    url: "/dashboard/services",
    icon: Briefcase,
  },
  {
    title: "Technologies",
    url: "/dashboard/technologies",
    icon: Code,
  },
  {
    title: "Projects",
    url: "/dashboard/projects",
    icon: FolderOpen,
  },
  {
    title: "Work Experience",
    url: "/dashboard/work-experiences",
    icon: Briefcase,
  },
  {
    title: "Education",
    url: "/dashboard/education",
    icon: GraduationCap,
  },
  {
    title: "Organizations",
    url: "/dashboard/organizations",
    icon: Building,
  },
  {
    title: "Achievements",
    url: "/dashboard/achievements",
    icon: Trophy,
  },
  {
    title: "Certifications",
    url: "/dashboard/certifications",
    icon: Award,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { signOut } = useAuth()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-4 py-2">
          <h2 className="text-lg font-semibold">Portfolio Admin</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4">
          <Button variant="outline" className="w-full bg-transparent" onClick={() => signOut()}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
