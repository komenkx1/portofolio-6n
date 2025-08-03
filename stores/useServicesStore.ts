import { create } from "zustand"
import type { Service } from "@/lib/types"
import api from "@/lib/api"

interface ServicesState {
  services: Service[]
  loading: boolean
  error: string | null
  fetchServices: () => Promise<void>
  createService: (data: Omit<Service, "id" | "profile_id">) => Promise<void>
  updateService: (id: string, data: Partial<Service>) => Promise<void>
  deleteService: (id: string) => Promise<void>
}

export const useServicesStore = create<ServicesState>((set, get) => ({
  services: [],
  loading: false,
  error: null,

  fetchServices: async () => {
    set({ loading: true, error: null })
    try {
      const response = await api.get("/services")
      set({ services: response.data, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  createService: async (data) => {
    set({ loading: true, error: null })
    try {
      const response = await api.post("/services", data)
      const { services } = get()
      set({ services: [...services, response.data], loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  updateService: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const response = await api.put(`/services/${id}`, data)
      const { services } = get()
      set({
        services: services.map((s) => (s.id === id ? response.data : s)),
        loading: false,
      })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  deleteService: async (id) => {
    set({ loading: true, error: null })
    try {
      await api.delete(`/services/${id}`)
      const { services } = get()
      set({ services: services.filter((s) => s.id !== id), loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },
}))
