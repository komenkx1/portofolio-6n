"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Service } from "@/lib/types"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
  })

  useEffect(() => {
    fetchServices()
  }, [])

  async function fetchServices() {
    try {
      const { data, error } = await supabase.from("services").select("*").order("title")

      if (error) throw error
      setServices(data || [])
    } catch (error) {
      console.error("Error fetching services:", error)
      toast.error("Failed to fetch services")
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      // Get the first profile ID (assuming single profile)
      const { data: profiles } = await supabase.from("profile").select("id").limit(1).single()

      if (!profiles) {
        toast.error("No profile found")
        return
      }

      if (editingService) {
        const { error } = await supabase
          .from("services")
          .update({
            title: formData.title,
            description: formData.description,
            image_url: formData.image_url,
          })
          .eq("id", editingService.id)

        if (error) throw error
        toast.success("Service updated successfully")
      } else {
        const { error } = await supabase.from("services").insert({
          profile_id: profiles.id,
          title: formData.title,
          description: formData.description,
          image_url: formData.image_url,
        })

        if (error) throw error
        toast.success("Service created successfully")
      }

      setDialogOpen(false)
      setEditingService(null)
      setFormData({ title: "", description: "", image_url: "" })
      fetchServices()
    } catch (error) {
      console.error("Error saving service:", error)
      toast.error("Failed to save service")
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this service?")) return

    try {
      const { error } = await supabase.from("services").delete().eq("id", id)

      if (error) throw error
      toast.success("Service deleted successfully")
      fetchServices()
    } catch (error) {
      console.error("Error deleting service:", error)
      toast.error("Failed to delete service")
    }
  }

  function openEditDialog(service: Service) {
    setEditingService(service)
    setFormData({
      title: service.title,
      description: service.description || "",
      image_url: service.image_url || "",
    })
    setDialogOpen(true)
  }

  function openCreateDialog() {
    setEditingService(null)
    setFormData({ title: "", description: "", image_url: "" })
    setDialogOpen(true)
  }

  const columns: ColumnDef<Service>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.getValue("description") as string
        return description ? (
          <div className="max-w-[300px] truncate">{description}</div>
        ) : (
          <span className="text-muted-foreground">No description</span>
        )
      },
    },
    {
      accessorKey: "image_url",
      header: "Image",
      cell: ({ row }) => {
        const imageUrl = row.getValue("image_url") as string
        return imageUrl ? (
          <img src={imageUrl || "/placeholder.svg"} alt="Service" className="h-10 w-10 rounded object-cover" />
        ) : (
          <span className="text-muted-foreground">No image</span>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const service = row.original
        return (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => openEditDialog(service)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleDelete(service.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">Manage your services and offerings</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingService ? "Edit Service" : "Add Service"}</DialogTitle>
              <DialogDescription>
                {editingService ? "Update the service information below." : "Add a new service to your portfolio."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editingService ? "Update" : "Create"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable columns={columns} data={services} searchKey="title" searchPlaceholder="Search services..." />
    </div>
  )
}
