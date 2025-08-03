import { create } from "zustand"
import axios from "axios"
import { toast } from "sonner"
import type { Technology } from "@/lib/types"

interface TechnologiesState {
  technologies: Technology[]
  isLoading: boolean
  fetchTechnologies: () => Promise<void>
  createTechnology: (data: Omit<Technology, "id" | "created_at" | "updated_at">) => Promise<void>
  updateTechnology: (id: string, data: Partial<Technology>) => Promise<void>
  deleteTechnology: (id: string) => Promise<void>
}

export const useTechnologiesStore = create<TechnologiesState>((set, get) => ({
  technologies: [],
  isLoading: false,

  fetchTechnologies: async () => {
    set({ isLoading: true })
    try {
      const response = await axios.get("/api/technologies")
      set({ technologies: response.data })
    } catch (error) {
      toast.error("Failed to fetch technologies")
      console.error("Error fetching technologies:", error)
    } finally {
      set({ isLoading: false })
    }
  },

  createTechnology: async (data) => {
    try {
      const response = await axios.post("/api/technologies", data)
      set({ technologies: [...get().technologies, response.data] })
      toast.success("Technology created successfully")
    } catch (error) {
      toast.error("Failed to create technology")
      throw error
    }
  },

  updateTechnology: async (id, data) => {
    try {
      const response = await axios.put(`/api/technologies/${id}`, data)
      set({
        technologies: get().technologies.map((tech) => (tech.id === id ? response.data : tech)),
      })
      toast.success("Technology updated successfully")
    } catch (error) {
      toast.error("Failed to update technology")
      throw error
    }
  },

  deleteTechnology: async (id) => {
    try {
      await axios.delete(`/api/technologies/${id}`)
      set({
        technologies: get().technologies.filter((tech) => tech.id !== id),
      })
      toast.success("Technology deleted successfully")
    } catch (error) {
      toast.error("Failed to delete technology")
      throw error
    }
  },
}))
