import { create } from "zustand"
import axios from "axios"
import { toast } from "sonner"
import type { Service } from "@/lib/types"

interface ServicesState {
  services: Service[]
  isLoading: boolean
  fetchServices: () => Promise<void>
  createService: (data: Omit<Service, "id" | "created_at" | "updated_at">) => Promise<void>
  updateService: (id: string, data: Partial<Service>) => Promise<void>
  deleteService: (id: string) => Promise<void>
}

export const useServicesStore = create<ServicesState>((set, get) => ({
  services: [],
  isLoading: false,

  fetchServices: async () => {
    set({ isLoading: true })
    try {
      const response = await axios.get("/api/services")
      set({ services: response.data })
    } catch (error) {
      toast.error("Failed to fetch services")
      console.error("Error fetching services:", error)
    } finally {
      set({ isLoading: false })
    }
  },

  createService: async (data) => {
    try {
      const response = await axios.post("/api/services", data)
      set({ services: [...get().services, response.data] })
      toast.success("Service created successfully")
    } catch (error) {
      toast.error("Failed to create service")
      throw error
    }
  },

  updateService: async (id, data) => {
    try {
      const response = await axios.put(`/api/services/${id}`, data)
      set({
        services: get().services.map((service) => (service.id === id ? response.data : service)),
      })
      toast.success("Service updated successfully")
    } catch (error) {
      toast.error("Failed to update service")
      throw error
    }
  },

  deleteService: async (id) => {
    try {
      await axios.delete(`/api/services/${id}`)
      set({
        services: get().services.filter((service) => service.id !== id),
      })
      toast.success("Service deleted successfully")
    } catch (error) {
      toast.error("Failed to delete service")
      throw error
    }
  },
}))
