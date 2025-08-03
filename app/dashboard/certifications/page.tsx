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
import type { Certification } from "@/lib/types"
import { toast } from "sonner"
import { MoreHorizontal, Plus, Pencil, Trash2, Award } from "lucide-react"
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
import { useCertificationsStore } from "@/stores/useCertificationsStore"
import { format } from "date-fns"

export default function CertificationsPage() {
  const {
    certifications,
    loading,
    fetchCertifications,
    createCertification,
    updateCertification,
    deleteCertification,
  } = useCertificationsStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [certificationToDelete, setCertificationToDelete] = useState<Certification | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    issuer: "",
    issue_date: "",
    expiry_date: "",
    credential_id: "",
    credential_url: "",
    description: "",
  })

  useEffect(() => {
    fetchCertifications()
  }, [fetchCertifications])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const data = {
        ...formData,
        expiry_date: formData.expiry_date || null,
      }

      if (editingCertification) {
        await updateCertification(editingCertification.id, data)
        toast.success("Certification updated successfully")
      } else {
        await createCertification(data)
        toast.success("Certification created successfully")
      }

      setDialogOpen(false)
      setEditingCertification(null)
      setFormData({
        name: "",
        issuer: "",
        issue_date: "",
        expiry_date: "",
        credential_id: "",
        credential_url: "",
        description: "",
      })
    } catch (error: any) {
      toast.error("Failed to save certification")
    }
  }

  const handleEdit = (certification: Certification) => {
    setEditingCertification(certification)
    setFormData({
      name: certification.name,
      issuer: certification.issuer,
      issue_date: certification.issue_date,
      expiry_date: certification.expiry_date || "",
      credential_id: certification.credential_id || "",
      credential_url: certification.credential_url || "",
      description: certification.description || "",
    })
    setDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!certificationToDelete) return

    try {
      await deleteCertification(certificationToDelete.id)
      toast.success("Certification deleted successfully")
      setDeleteDialogOpen(false)
      setCertificationToDelete(null)
    } catch (error: any) {
      toast.error("Failed to delete certification")
    }
  }

  const columns: ColumnDef<Certification>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "issuer",
      header: "Issuer",
    },
    {
      accessorKey: "issue_date",
      header: "Issue Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("issue_date"))
        return format(date, "MMM yyyy")
      },
    },
    {
      accessorKey: "expiry_date",
      header: "Expiry",
      cell: ({ row }) => {
        const expiryDate = row.getValue("expiry_date") as string
        if (!expiryDate) return "No expiry"

        const date = new Date(expiryDate)
        const now = new Date()
        const isExpired = date < now

        return (
          <div className={isExpired ? "text-red-600" : "text-green-600"}>
            {format(date, "MMM yyyy")}
            {isExpired && " (Expired)"}
          </div>
        )
      },
    },
    {
      accessorKey: "credential_url",
      header: "Credential",
      cell: ({ row }) => {
        const url = row.getValue("credential_url") as string
        return url ? (
          <div className="text-green-600">✓ Has credential</div>
        ) : (
          <div className="text-gray-400">No credential</div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const certification = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(certification)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setCertificationToDelete(certification)
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
          <Award className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Certifications</h1>
            <p className="text-muted-foreground">Manage your professional certifications</p>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingCertification(null)
                setFormData({
                  name: "",
                  issuer: "",
                  issue_date: "",
                  expiry_date: "",
                  credential_id: "",
                  credential_url: "",
                  description: "",
                })
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Certification
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingCertification ? "Edit Certification" : "Add New Certification"}</DialogTitle>
                <DialogDescription>
                  {editingCertification
                    ? "Update the certification information below."
                    : "Fill in the details for the new certification."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Certification Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="issuer">Issuer</Label>
                    <Input
                      id="issuer"
                      value={formData.issuer}
                      onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
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
                    placeholder="Describe the certification..."
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="issue_date">Issue Date</Label>
                    <Input
                      id="issue_date"
                      type="date"
                      value={formData.issue_date}
                      onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry_date">Expiry Date (Optional)</Label>
                    <Input
                      id="expiry_date"
                      type="date"
                      value={formData.expiry_date}
                      onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="credential_id">Credential ID</Label>
                    <Input
                      id="credential_id"
                      value={formData.credential_id}
                      onChange={(e) => setFormData({ ...formData, credential_id: e.target.value })}
                      placeholder="Certificate ID or number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="credential_url">Credential URL</Label>
                    <Input
                      id="credential_url"
                      type="url"
                      value={formData.credential_url}
                      onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                      placeholder="https://verify.example.com"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editingCertification ? "Update Certification" : "Create Certification"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={certifications}
        searchKey="name"
        searchPlaceholder="Search certifications..."
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the certification "
              {certificationToDelete?.name}".
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
