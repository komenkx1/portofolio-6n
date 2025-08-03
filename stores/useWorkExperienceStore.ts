import { create } from "zustand"
import type { WorkExperience } from "@/lib/types"
import api from "@/lib/api"

interface WorkExperienceState {
  workExperiences: WorkExperience[]
  loading: boolean
  error: string | null
  fetchWorkExperiences: () => Promise<void>
  createWorkExperience: (data: Omit<WorkExperience, "id" | "profile_id">) => Promise<void>
  updateWorkExperience: (id: string, data: Partial<WorkExperience>) => Promise<void>
  deleteWorkExperience: (id: string) => Promise<void>
}

export const useWorkExperienceStore = create<WorkExperienceState>((set, get) => ({
  workExperiences: [],
  loading: false,
  error: null,

  fetchWorkExperiences: async () => {
    set({ loading: true, error: null })
    try {
      const response = await api.get("/work-experiences")
      set({ workExperiences: response.data, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  createWorkExperience: async (data) => {
    set({ loading: true, error: null })
    try {
      const response = await api.post("/work-experiences", data)
      const { workExperiences } = get()
      set({ workExperiences: [...workExperiences, response.data], loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  updateWorkExperience: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const response = await api.put(`/work-experiences/${id}`, data)
      const { workExperiences } = get()
      set({
        workExperiences: workExperiences.map((w) => (w.id === id ? response.data : w)),
        loading: false,
      })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  deleteWorkExperience: async (id) => {
    set({ loading: true, error: null })
    try {
      await api.delete(`/work-experiences/${id}`)
      const { workExperiences } = get()
      set({ workExperiences: workExperiences.filter((w) => w.id !== id), loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },
}))
