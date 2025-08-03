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
import type { Education } from "@/lib/types"
import { toast } from "sonner"
import { MoreHorizontal, Plus, Pencil, Trash2, GraduationCap } from "lucide-react"
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
import { useEducationStore } from "@/stores/useEducationStore"
import { format } from "date-fns"

export default function EducationPage() {
  const { education, loading, fetchEducation, createEducation, updateEducation, deleteEducation } = useEducationStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEducation, setEditingEducation] = useState<Education | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [educationToDelete, setEducationToDelete] = useState<Education | null>(null)
  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    field_of_study: "",
    description: "",
    start_date: "",
    end_date: "",
    gpa: "",
    location: "",
  })

  useEffect(() => {
    fetchEducation()
  }, [fetchEducation])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const data = {
        ...formData,
        end_date: formData.end_date || null,
        gpa: formData.gpa || null,
      }

      if (editingEducation) {
        await updateEducation(editingEducation.id, data)
        toast.success("Education updated successfully")
      } else {
        await createEducation(data)
        toast.success("Education created successfully")
      }

      setDialogOpen(false)
      setEditingEducation(null)
      setFormData({
        institution: "",
        degree: "",
        field_of_study: "",
        description: "",
        start_date: "",
        end_date: "",
        gpa: "",
        location: "",
      })
    } catch (error: any) {
      toast.error("Failed to save education")
    }
  }

  const handleEdit = (edu: Education) => {
    setEditingEducation(edu)
    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      field_of_study: edu.field_of_study || "",
      description: edu.description || "",
      start_date: edu.start_date,
      end_date: edu.end_date || "",
      gpa: edu.gpa || "",
      location: edu.location || "",
    })
    setDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!educationToDelete) return

    try {
      await deleteEducation(educationToDelete.id)
      toast.success("Education deleted successfully")
      setDeleteDialogOpen(false)
      setEducationToDelete(null)
    } catch (error: any) {
      toast.error("Failed to delete education")
    }
  }

  const columns: ColumnDef<Education>[] = [
    {
      accessorKey: "institution",
      header: "Institution",
    },
    {
      accessorKey: "degree",
      header: "Degree",
    },
    {
      accessorKey: "field_of_study",
      header: "Field of Study",
      cell: ({ row }) => {
        const field = row.getValue("field_of_study") as string
        return field || "N/A"
      },
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
      accessorKey: "gpa",
      header: "GPA",
      cell: ({ row }) => {
        const gpa = row.getValue("gpa") as string
        return gpa || "N/A"
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const edu = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(edu)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setEducationToDelete(edu)
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
          <GraduationCap className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Education</h1>
            <p className="text-muted-foreground">Manage your educational background</p>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingEducation(null)
                setFormData({
                  institution: "",
                  degree: "",
                  field_of_study: "",
                  description: "",
                  start_date: "",
                  end_date: "",
                  gpa: "",
                  location: "",
                })
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Education
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingEducation ? "Edit Education" : "Add New Education"}</DialogTitle>
                <DialogDescription>
                  {editingEducation
                    ? "Update the education information below."
                    : "Fill in the details for the new education."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="institution">Institution</Label>
                    <Input
                      id="institution"
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="degree">Degree</Label>
                    <Input
                      id="degree"
                      value={formData.degree}
                      onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                      required
                      placeholder="e.g., Bachelor of Science"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="field_of_study">Field of Study</Label>
                  <Input
                    id="field_of_study"
                    value={formData.field_of_study}
                    onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
                    placeholder="e.g., Computer Science"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    placeholder="Relevant coursework, achievements, etc..."
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
                    <Label htmlFor="gpa">GPA (Optional)</Label>
                    <Input
                      id="gpa"
                      value={formData.gpa}
                      onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                      placeholder="e.g., 3.8/4.0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="City, Country"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editingEducation ? "Update Education" : "Create Education"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={education}
        searchKey="institution"
        searchPlaceholder="Search institutions..."
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the education record from "
              {educationToDelete?.institution}".
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
