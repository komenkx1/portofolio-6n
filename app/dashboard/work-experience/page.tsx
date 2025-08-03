"use client"

import type React from "react"

import { useEffect, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
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
import type { WorkExperience } from "@/lib/types"
import { toast } from "sonner"
import { MoreHorizontal, Plus, Pencil, Trash2, Briefcase } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useWorkExperienceStore } from "@/stores/useWorkExperienceStore"
import { format } from "date-fns"

export default function WorkExperiencePage() {
  const {
    workExperiences,
    loading,
    fetchWorkExperiences,
    createWorkExperience,
    updateWorkExperience,
    deleteWorkExperience,
  } = useWorkExperienceStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState<WorkExperience | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [experienceToDelete, setExperienceToDelete] = useState<WorkExperience | null>(null)
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    description: "",
    start_date: "",
    end_date: "",
    location: "",
    company_url: "",
  })

  useEffect(() => {
    fetchWorkExperiences()
  }, [fetchWorkExperiences])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const data = {
        ...formData,
        end_date: formData.end_date || null,
      }

      if (editingExperience) {
        await updateWorkExperience(editingExperience.id, data)
        toast.success("Work experience updated successfully")
      } else {
        await createWorkExperience(data)
        toast.success("Work experience created successfully")
      }

      setDialogOpen(false)
      setEditingExperience(null)
      setFormData({
        company: "",
        position: "",
        description: "",
        start_date: "",
        end_date: "",
        location: "",
        company_url: "",
      })
    } catch (error: any) {
      toast.error("Failed to save work experience")
    }
  }

  const handleEdit = (experience: WorkExperience) => {
    setEditingExperience(experience)
    setFormData({
      company: experience.company,
      position: experience.position,
      description: experience.description || "",
      start_date: experience.start_date,
      end_date: experience.end_date || "",
      location: experience.location || "",
      company_url: experience.company_url || "",
    })
    setDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!experienceToDelete) return

    try {
      await deleteWorkExperience(experienceToDelete.id)
      toast.success("Work experience deleted successfully")
      setDeleteDialogOpen(false)
      setExperienceToDelete(null)
    } catch (error: any) {
      toast.error("Failed to delete work experience")
    }
  }

  const columns: ColumnDef<WorkExperience>[] = [
    {
      accessorKey: "company",
      header: "Company",
    },
    {
      accessorKey: "position",
      header: "Position",
    },
    {
      accessorKey: "start_date",
      header: "Duration",
      cell: ({ row }) => {
        const startDate = new Date(row.getValue("start_date"))
        const endDate = row.original.end_date ? new Date(row.original.end_date) : null

        return (
          <div>
            {format(startDate, "MMM yyyy")} - {endDate ? format(endDate, "MMM yyyy") : "Present"}
          </div>
        )
      },
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => {
        const location = row.getValue("location") as string
        return location || "Remote"
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const experience = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(experience)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setExperienceToDelete(experience)
                  setDeleteDialogOpen(true)
                }}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
        <div className="flex items-center gap-2">
          <Briefcase className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Work Experience</h1>
            <p className="text-muted-foreground">Manage your professional experience</p>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingExperience(null)
                setFormData({
                  company: "",
                  position: "",
                  description: "",
                  start_date: "",
                  end_date: "",
                  location: "",
                  company_url: "",
                })
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingExperience ? "Edit Work Experience" : "Add New Work Experience"}</DialogTitle>
                <DialogDescription>
                  {editingExperience
                    ? "Update the work experience information below."
                    : "Fill in the details for the new work experience."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    placeholder="Describe your role and achievements..."
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date (Leave empty if current)</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="City, Country or Remote"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company_url">Company Website</Label>
                    <Input
                      id="company_url"
                      type="url"
                      value={formData.company_url}
                      onChange={(e) => setFormData({ ...formData, company_url: e.target.value })}
                      placeholder="https://company.com"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editingExperience ? "Update Experience" : "Create Experience"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable columns={columns} data={workExperiences} searchKey="company" searchPlaceholder="Search companies..." />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the work experience at "
              {experienceToDelete?.company}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
