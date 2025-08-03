import { create } from "zustand"
import api from "@/lib/api"
import type { Project } from "@/lib/types"
import { toast } from "sonner"

interface ProjectsState {
  projects: Project[]
  isLoading: boolean
  fetchProjects: () => Promise<void>
  createProject: (data: Omit<Project, "id" | "created_at" | "updated_at">) => Promise<void>
  updateProject: (id: string, data: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  isLoading: false,

  fetchProjects: async () => {
    set({ isLoading: true })
    try {
      const response = await api.get("/projects")
      set({ projects: response.data })
    } catch (error) {
      toast.error("Failed to fetch projects")
      console.error("Error fetching projects:", error)
    } finally {
      set({ isLoading: false })
    }
  },

  createProject: async (data) => {
    try {
      const response = await api.post("/projects", data)
      set((state) => ({
        projects: [...state.projects, response.data],
      }))
      toast.success("Project created successfully")
    } catch (error) {
      toast.error("Failed to create project")
      throw error
    }
  },

  updateProject: async (id, data) => {
    try {
      const response = await api.put(`/projects/${id}`, data)
      set((state) => ({
        projects: state.projects.map((project) => (project.id === id ? response.data : project)),
      }))
      toast.success("Project updated successfully")
    } catch (error) {
      toast.error("Failed to update project")
      throw error
    }
  },

  deleteProject: async (id) => {
    try {
      await api.delete(`/projects/${id}`)
      set((state) => ({
        projects: state.projects.filter((project) => project.id !== id),
      }))
      toast.success("Project deleted successfully")
    } catch (error) {
      toast.error("Failed to delete project")
      throw error
    }
  },
}))
