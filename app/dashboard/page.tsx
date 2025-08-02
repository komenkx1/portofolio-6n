"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Briefcase, Code, FolderOpen, GraduationCap, Building, Trophy, Award } from "lucide-react"

interface DashboardStats {
  profiles: number
  services: number
  technologies: number
  projects: number
  workExperiences: number
  education: number
  organizations: number
  achievements: number
  certifications: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    profiles: 0,
    services: 0,
    technologies: 0,
    projects: 0,
    workExperiences: 0,
    education: 0,
    organizations: 0,
    achievements: 0,
    certifications: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          profilesResult,
          servicesResult,
          technologiesResult,
          projectsResult,
          workExperiencesResult,
          educationResult,
          organizationsResult,
          achievementsResult,
          certificationsResult,
        ] = await Promise.all([
          supabase.from("profile").select("*", { count: "exact", head: true }),
          supabase.from("services").select("*", { count: "exact", head: true }),
          supabase.from("technologies").select("*", { count: "exact", head: true }),
          supabase.from("projects").select("*", { count: "exact", head: true }),
          supabase.from("work_experiences").select("*", { count: "exact", head: true }),
          supabase.from("education").select("*", { count: "exact", head: true }),
          supabase.from("organizational_experiences").select("*", { count: "exact", head: true }),
          supabase.from("achievements").select("*", { count: "exact", head: true }),
          supabase.from("certifications").select("*", { count: "exact", head: true }),
        ])

        setStats({
          profiles: profilesResult.count || 0,
          services: servicesResult.count || 0,
          technologies: technologiesResult.count || 0,
          projects: projectsResult.count || 0,
          workExperiences: workExperiencesResult.count || 0,
          education: educationResult.count || 0,
          organizations: organizationsResult.count || 0,
          achievements: achievementsResult.count || 0,
          certifications: certificationsResult.count || 0,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: "Profiles",
      value: stats.profiles,
      icon: User,
      description: "Total profiles",
    },
    {
      title: "Services",
      value: stats.services,
      icon: Briefcase,
      description: "Services offered",
    },
    {
      title: "Technologies",
      value: stats.technologies,
      icon: Code,
      description: "Technologies mastered",
    },
    {
      title: "Projects",
      value: stats.projects,
      icon: FolderOpen,
      description: "Projects completed",
    },
    {
      title: "Work Experience",
      value: stats.workExperiences,
      icon: Briefcase,
      description: "Work experiences",
    },
    {
      title: "Education",
      value: stats.education,
      icon: GraduationCap,
      description: "Educational background",
    },
    {
      title: "Organizations",
      value: stats.organizations,
      icon: Building,
      description: "Organizational experiences",
    },
    {
      title: "Achievements",
      value: stats.achievements,
      icon: Trophy,
      description: "Achievements earned",
    },
    {
      title: "Certifications",
      value: stats.certifications,
      icon: Award,
      description: "Certifications obtained",
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your portfolio data</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
