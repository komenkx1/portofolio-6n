"use client"

import {
  Calendar,
  Home,
  User,
  Briefcase,
  GraduationCap,
  Award,
  BadgeIcon as Certificate,
  Wrench,
  Code,
  FolderOpen,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

const items = [
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
    icon: Wrench,
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
    url: "/dashboard/work-experience",
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
    icon: Calendar,
  },
  {
    title: "Achievements",
    url: "/dashboard/achievements",
    icon: Award,
  },
  {
    title: "Certifications",
    url: "/dashboard/certifications",
    icon: Certificate,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Portfolio Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
