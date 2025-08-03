import { create } from "zustand"
import type { Education } from "@/lib/types"
import api from "@/lib/api"

interface EducationState {
  education: Education[]
  loading: boolean
  error: string | null
  fetchEducation: () => Promise<void>
  createEducation: (data: Omit<Education, "id" | "profile_id">) => Promise<void>
  updateEducation: (id: string, data: Partial<Education>) => Promise<void>
  deleteEducation: (id: string) => Promise<void>
}

export const useEducationStore = create<EducationState>((set, get) => ({
  education: [],
  loading: false,
  error: null,

  fetchEducation: async () => {
    set({ loading: true, error: null })
    try {
      const response = await api.get("/education")
      set({ education: response.data, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  createEducation: async (data) => {
    set({ loading: true, error: null })
    try {
      const response = await api.post("/education", data)
      const { education } = get()
      set({ education: [...education, response.data], loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  updateEducation: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const response = await api.put(`/education/${id}`, data)
      const { education } = get()
      set({
        education: education.map((e) => (e.id === id ? response.data : e)),
        loading: false,
      })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  deleteEducation: async (id) => {
    set({ loading: true, error: null })
    try {
      await api.delete(`/education/${id}`)
      const { education } = get()
      set({ education: education.filter((e) => e.id !== id), loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },
}))
