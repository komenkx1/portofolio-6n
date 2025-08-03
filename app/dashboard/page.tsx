"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useServicesStore } from "@/stores/useServicesStore"
import { useTechnologiesStore } from "@/stores/useTechnologiesStore"
import { useProjectsStore } from "@/stores/useProjectsStore"
import { Briefcase, Code, FolderOpen, Wrench } from "lucide-react"

export default function DashboardPage() {
  const { services, fetchServices } = useServicesStore()
  const { technologies, fetchTechnologies } = useTechnologiesStore()
  const { projects, fetchProjects } = useProjectsStore()

  useEffect(() => {
    fetchServices()
    fetchTechnologies()
    fetchProjects()
  }, [fetchServices, fetchTechnologies, fetchProjects])

  const stats = [
    {
      title: "Services",
      value: services.length,
      description: "Total services offered",
      icon: Wrench,
    },
    {
      title: "Technologies",
      value: technologies.length,
      description: "Technologies mastered",
      icon: Code,
    },
    {
      title: "Projects",
      value: projects.length,
      description: "Projects completed",
      icon: FolderOpen,
    },
    {
      title: "Experience",
      value: "4+",
      description: "Years of experience",
      icon: Briefcase,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your portfolio admin dashboard</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Portfolio dashboard initialized</p>
                  <p className="text-sm text-muted-foreground">Admin dashboard is ready for content management</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your portfolio content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">• Add new services</p>
              <p className="text-sm">• Update project information</p>
              <p className="text-sm">• Manage technologies</p>
              <p className="text-sm">• Edit profile details</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
