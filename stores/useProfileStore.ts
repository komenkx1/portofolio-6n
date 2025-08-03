import { create } from "zustand"
import type { Profile } from "@/lib/types"
import api from "@/lib/api"

interface ProfileState {
  profile: Profile | null
  loading: boolean
  error: string | null
  fetchProfile: () => Promise<void>
  updateProfile: (data: Partial<Profile>) => Promise<void>
  createProfile: (data: Omit<Profile, "id" | "created_at">) => Promise<void>
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfile: async () => {
    set({ loading: true, error: null })
    try {
      const response = await api.get("/profile")
      set({ profile: response.data, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  updateProfile: async (data) => {
    set({ loading: true, error: null })
    try {
      const response = await api.put("/profile", data)
      set({ profile: response.data, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  createProfile: async (data) => {
    set({ loading: true, error: null })
    try {
      const response = await api.post("/profile", data)
      set({ profile: response.data, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },
}))
