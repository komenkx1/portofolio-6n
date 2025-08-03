import { create } from "zustand"
import type { Certification } from "@/lib/types"
import api from "@/lib/api"

interface CertificationsState {
  certifications: Certification[]
  loading: boolean
  error: string | null
  fetchCertifications: () => Promise<void>
  createCertification: (data: Omit<Certification, "id" | "profile_id">) => Promise<void>
  updateCertification: (id: string, data: Partial<Certification>) => Promise<void>
  deleteCertification: (id: string) => Promise<void>
}

export const useCertificationsStore = create<CertificationsState>((set, get) => ({
  certifications: [],
  loading: false,
  error: null,

  fetchCertifications: async () => {
    set({ loading: true, error: null })
    try {
      const response = await api.get("/certifications")
      set({ certifications: response.data, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  createCertification: async (data) => {
    set({ loading: true, error: null })
    try {
      const response = await api.post("/certifications", data)
      const { certifications } = get()
      set({ certifications: [...certifications, response.data], loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  updateCertification: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const response = await api.put(`/certifications/${id}`, data)
      const { certifications } = get()
      set({
        certifications: certifications.map((c) => (c.id === id ? response.data : c)),
        loading: false,
      })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  deleteCertification: async (id) => {
    set({ loading: true, error: null })
    try {
      await api.delete(`/certifications/${id}`)
      const { certifications } = get()
      set({ certifications: certifications.filter((c) => c.id !== id), loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },
}))
