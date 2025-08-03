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
import type { OrganizationalExperience } from "@/lib/types"
import { toast } from "sonner"
import { MoreHorizontal, Plus, Pencil, Trash2, Building2 } from "lucide-react"
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
import { useOrganizationsStore } from "@/stores/useOrganizationsStore"
import { format } from "date-fns"

export default function OrganizationsPage() {
  const { organizations, loading, fetchOrganizations, createOrganization, updateOrganization, deleteOrganization } =
    useOrganizationsStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingOrganization, setEditingOrganization] = useState<OrganizationalExperience | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [organizationToDelete, setOrganizationToDelete] = useState<OrganizationalExperience | null>(null)
  const [formData, setFormData] = useState({
    organization: "",
    position: "",
    description: "",
    start_date: "",
    end_date: "",
    location: "",
  })

  useEffect(() => {
    fetchOrganizations()
  }, [fetchOrganizations])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const data = {
        ...formData,
        end_date: formData.end_date || null,
      }

      if (editingOrganization) {
        await updateOrganization(editingOrganization.id, data)
        toast.success("Organization updated successfully")
      } else {
        await createOrganization(data)
        toast.success("Organization created successfully")
      }

      setDialogOpen(false)
      setEditingOrganization(null)
      setFormData({
        organization: "",
        position: "",
        description: "",
        start_date: "",
        end_date: "",
        location: "",
      })
    } catch (error: any) {
      toast.error("Failed to save organization")
    }
  }

  const handleEdit = (org: OrganizationalExperience) => {
    setEditingOrganization(org)
    setFormData({
      organization: org.organization,
      position: org.position,
      description: org.description || "",
      start_date: org.start_date,
      end_date: org.end_date || "",
      location: org.location || "",
    })
    setDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!organizationToDelete) return

    try {
      await deleteOrganization(organizationToDelete.id)
      toast.success("Organization deleted successfully")
      setDeleteDialogOpen(false)
      setOrganizationToDelete(null)
    } catch (error: any) {
      toast.error("Failed to delete organization")
    }
  }

  const columns: ColumnDef<OrganizationalExperience>[] = [
    {
      accessorKey: "organization",
      header: "Organization",
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
        return location || "N/A"
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const org = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(org)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setOrganizationToDelete(org)
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
          <Building2 className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
            <p className="text-muted-foreground">Manage your organizational involvement</p>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingOrganization(null)
                setFormData({
                  organization: "",
                  position: "",
                  description: "",
                  start_date: "",
                  end_date: "",
                  location: "",
                })
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Organization
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingOrganization ? "Edit Organization" : "Add New Organization"}</DialogTitle>
                <DialogDescription>
                  {editingOrganization
                    ? "Update the organization information below."
                    : "Fill in the details for the new organization."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization</Label>
                    <Input
                      id="organization"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
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
                    placeholder="Describe your role and contributions..."
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
              <DialogFooter>
                <Button type="submit">{editingOrganization ? "Update Organization" : "Create Organization"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={organizations}
        searchKey="organization"
        searchPlaceholder="Search organizations..."
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the organization "
              {organizationToDelete?.organization}".
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
