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
import type { Technology } from "@/lib/types"
import { toast } from "sonner"
import { MoreHorizontal, Plus, Pencil, Trash2 } from "lucide-react"
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
import { useTechnologiesStore } from "@/stores/useTechnologiesStore"

export default function TechnologiesPage() {
  const { technologies, loading, fetchTechnologies, createTechnology, updateTechnology, deleteTechnology } =
    useTechnologiesStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTechnology, setEditingTechnology] = useState<Technology | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [technologyToDelete, setTechnologyToDelete] = useState<Technology | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    icon_url: "",
  })

  useEffect(() => {
    fetchTechnologies()
  }, [fetchTechnologies])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingTechnology) {
        await updateTechnology(editingTechnology.id, formData)
        toast.success("Technology updated successfully")
      } else {
        await createTechnology(formData)
        toast.success("Technology created successfully")
      }

      setDialogOpen(false)
      setEditingTechnology(null)
      setFormData({ name: "", icon_url: "" })
    } catch (error: any) {
      toast.error("Failed to save technology")
    }
  }

  const handleEdit = (technology: Technology) => {
    setEditingTechnology(technology)
    setFormData({
      name: technology.name,
      icon_url: technology.icon_url || "",
    })
    setDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!technologyToDelete) return

    try {
      await deleteTechnology(technologyToDelete.id)
      toast.success("Technology deleted successfully")
      setDeleteDialogOpen(false)
      setTechnologyToDelete(null)
    } catch (error: any) {
      toast.error("Failed to delete technology")
    }
  }

  const columns: ColumnDef<Technology>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "icon_url",
      header: "Icon",
      cell: ({ row }) => {
        const iconUrl = row.getValue("icon_url") as string
        return iconUrl ? <div className="text-green-600">✓ Has icon</div> : <div className="text-gray-400">No icon</div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const technology = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(technology)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setTechnologyToDelete(technology)
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Technologies</h1>
          <p className="text-muted-foreground">Manage your technology stack</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingTechnology(null)
                setFormData({ name: "", icon_url: "" })
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Technology
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingTechnology ? "Edit Technology" : "Add New Technology"}</DialogTitle>
                <DialogDescription>
                  {editingTechnology
                    ? "Update the technology information below."
                    : "Fill in the details for the new technology."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="icon_url">Icon URL</Label>
                  <Input
                    id="icon_url"
                    type="url"
                    value={formData.icon_url}
                    onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
                    placeholder="https://example.com/icon.svg"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editingTechnology ? "Update Technology" : "Create Technology"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable columns={columns} data={technologies} searchKey="name" searchPlaceholder="Search technologies..." />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the technology "{technologyToDelete?.name}".
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
