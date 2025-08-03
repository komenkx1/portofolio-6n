import { create } from "zustand"
import type { Achievement } from "@/lib/types"
import api from "@/lib/api"

interface AchievementsState {
  achievements: Achievement[]
  loading: boolean
  error: string | null
  fetchAchievements: () => Promise<void>
  createAchievement: (data: Omit<Achievement, "id" | "profile_id">) => Promise<void>
  updateAchievement: (id: string, data: Partial<Achievement>) => Promise<void>
  deleteAchievement: (id: string) => Promise<void>
}

export const useAchievementsStore = create<AchievementsState>((set, get) => ({
  achievements: [],
  loading: false,
  error: null,

  fetchAchievements: async () => {
    set({ loading: true, error: null })
    try {
      const response = await api.get("/achievements")
      set({ achievements: response.data, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  createAchievement: async (data) => {
    set({ loading: true, error: null })
    try {
      const response = await api.post("/achievements", data)
      const { achievements } = get()
      set({ achievements: [...achievements, response.data], loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  updateAchievement: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const response = await api.put(`/achievements/${id}`, data)
      const { achievements } = get()
      set({
        achievements: achievements.map((a) => (a.id === id ? response.data : a)),
        loading: false,
      })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  deleteAchievement: async (id) => {
    set({ loading: true, error: null })
    try {
      await api.delete(`/achievements/${id}`)
      const { achievements } = get()
      set({ achievements: achievements.filter((a) => a.id !== id), loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },
}))
