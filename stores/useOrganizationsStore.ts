import { create } from "zustand"
import type { OrganizationalExperience } from "@/lib/types"
import api from "@/lib/api"

interface OrganizationsState {
  organizations: OrganizationalExperience[]
  loading: boolean
  error: string | null
  fetchOrganizations: () => Promise<void>
  createOrganization: (data: Omit<OrganizationalExperience, "id" | "profile_id">) => Promise<void>
  updateOrganization: (id: string, data: Partial<OrganizationalExperience>) => Promise<void>
  deleteOrganization: (id: string) => Promise<void>
}

export const useOrganizationsStore = create<OrganizationsState>((set, get) => ({
  organizations: [],
  loading: false,
  error: null,

  fetchOrganizations: async () => {
    set({ loading: true, error: null })
    try {
      const response = await api.get("/organizations")
      set({ organizations: response.data, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  createOrganization: async (data) => {
    set({ loading: true, error: null })
    try {
      const response = await api.post("/organizations", data)
      const { organizations } = get()
      set({ organizations: [...organizations, response.data], loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  updateOrganization: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const response = await api.put(`/organizations/${id}`, data)
      const { organizations } = get()
      set({
        organizations: organizations.map((o) => (o.id === id ? response.data : o)),
        loading: false,
      })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  deleteOrganization: async (id) => {
    set({ loading: true, error: null })
    try {
      await api.delete(`/organizations/${id}`)
      const { organizations } = get()
      set({ organizations: organizations.filter((o) => o.id !== id), loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },
}))
