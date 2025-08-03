import { create } from "zustand"
import type { Technology } from "@/lib/types"
import api from "@/lib/api"

interface TechnologiesState {
  technologies: Technology[]
  loading: boolean
  error: string | null
  fetchTechnologies: () => Promise<void>
  createTechnology: (data: Omit<Technology, "id">) => Promise<void>
  updateTechnology: (id: string, data: Partial<Technology>) => Promise<void>
  deleteTechnology: (id: string) => Promise<void>
}

export const useTechnologiesStore = create<TechnologiesState>((set, get) => ({
  technologies: [],
  loading: false,
  error: null,

  fetchTechnologies: async () => {
    set({ loading: true, error: null })
    try {
      const response = await api.get("/technologies")
      set({ technologies: response.data, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  createTechnology: async (data) => {
    set({ loading: true, error: null })
    try {
      const response = await api.post("/technologies", data)
      const { technologies } = get()
      set({ technologies: [...technologies, response.data], loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  updateTechnology: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const response = await api.put(`/technologies/${id}`, data)
      const { technologies } = get()
      set({
        technologies: technologies.map((t) => (t.id === id ? response.data : t)),
        loading: false,
      })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  deleteTechnology: async (id) => {
    set({ loading: true, error: null })
    try {
      await api.delete(`/technologies/${id}`)
      const { technologies } = get()
      set({ technologies: technologies.filter((t) => t.id !== id), loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },
}))
