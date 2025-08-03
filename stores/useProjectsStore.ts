import { create } from "zustand"
import type { Project, ProjectFeature } from "@/lib/types"
import api from "@/lib/api"

interface ProjectsState {
  projects: Project[]
  projectFeatures: ProjectFeature[]
  loading: boolean
  error: string | null
  fetchProjects: () => Promise<void>
  fetchProjectFeatures: (projectId: string) => Promise<void>
  createProject: (data: Omit<Project, "id" | "profile_id">) => Promise<void>
  updateProject: (id: string, data: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  createProjectFeature: (data: Omit<ProjectFeature, "id">) => Promise<void>
  updateProjectFeature: (id: string, data: Partial<ProjectFeature>) => Promise<void>
  deleteProjectFeature: (id: string) => Promise<void>
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  projectFeatures: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true, error: null })
    try {
      const response = await api.get("/projects")
      set({ projects: response.data, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  fetchProjectFeatures: async (projectId) => {
    set({ loading: true, error: null })
    try {
      const response = await api.get(`/projects/${projectId}/features`)
      set({ projectFeatures: response.data, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  createProject: async (data) => {
    set({ loading: true, error: null })
    try {
      const response = await api.post("/projects", data)
      const { projects } = get()
      set({ projects: [...projects, response.data], loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  updateProject: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const response = await api.put(`/projects/${id}`, data)
      const { projects } = get()
      set({
        projects: projects.map((p) => (p.id === id ? response.data : p)),
        loading: false,
      })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  deleteProject: async (id) => {
    set({ loading: true, error: null })
    try {
      await api.delete(`/projects/${id}`)
      const { projects } = get()
      set({ projects: projects.filter((p) => p.id !== id), loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  createProjectFeature: async (data) => {
    set({ loading: true, error: null })
    try {
      const response = await api.post("/project-features", data)
      const { projectFeatures } = get()
      set({ projectFeatures: [...projectFeatures, response.data], loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  updateProjectFeature: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const response = await api.put(`/project-features/${id}`, data)
      const { projectFeatures } = get()
      set({
        projectFeatures: projectFeatures.map((f) => (f.id === id ? response.data : f)),
        loading: false,
      })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  deleteProjectFeature: async (id) => {
    set({ loading: true, error: null })
    try {
      await api.delete(`/project-features/${id}`)
      const { projectFeatures } = get()
      set({ projectFeatures: projectFeatures.filter((f) => f.id !== id), loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },
}))
