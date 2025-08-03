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
import type { Achievement } from "@/lib/types"
import { toast } from "sonner"
import { MoreHorizontal, Plus, Pencil, Trash2, Trophy } from "lucide-react"
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
import { useAchievementsStore } from "@/stores/useAchievementsStore"
import { format } from "date-fns"

export default function AchievementsPage() {
  const { achievements, loading, fetchAchievements, createAchievement, updateAchievement, deleteAchievement } =
    useAchievementsStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [achievementToDelete, setAchievementToDelete] = useState<Achievement | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    issuer: "",
    url: "",
  })

  useEffect(() => {
    fetchAchievements()
  }, [fetchAchievements])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingAchievement) {
        await updateAchievement(editingAchievement.id, formData)
        toast.success("Achievement updated successfully")
      } else {
        await createAchievement(formData)
        toast.success("Achievement created successfully")
      }

      setDialogOpen(false)
      setEditingAchievement(null)
      setFormData({
        title: "",
        description: "",
        date: "",
        issuer: "",
        url: "",
      })
    } catch (error: any) {
      toast.error("Failed to save achievement")
    }
  }

  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement)
    setFormData({
      title: achievement.title,
      description: achievement.description || "",
      date: achievement.date,
      issuer: achievement.issuer || "",
      url: achievement.url || "",
    })
    setDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!achievementToDelete) return

    try {
      await deleteAchievement(achievementToDelete.id)
      toast.success("Achievement deleted successfully")
      setDeleteDialogOpen(false)
      setAchievementToDelete(null)
    } catch (error: any) {
      toast.error("Failed to delete achievement")
    }
  }

  const columns: ColumnDef<Achievement>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "issuer",
      header: "Issuer",
      cell: ({ row }) => {
        const issuer = row.getValue("issuer") as string
        return issuer || "N/A"
      },
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("date"))
        return format(date, "MMM dd, yyyy")
      },
    },
    {
      accessorKey: "url",
      header: "Link",
      cell: ({ row }) => {
        const url = row.getValue("url") as string
        return url ? <div className="text-green-600">✓ Has link</div> : <div className="text-gray-400">No link</div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const achievement = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(achievement)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setAchievementToDelete(achievement)
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
          <Trophy className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Achievements</h1>
            <p className="text-muted-foreground">Manage your awards and recognitions</p>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingAchievement(null)
                setFormData({
                  title: "",
                  description: "",
                  date: "",
                  issuer: "",
                  url: "",
                })
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Achievement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingAchievement ? "Edit Achievement" : "Add New Achievement"}</DialogTitle>
                <DialogDescription>
                  {editingAchievement
                    ? "Update the achievement information below."
                    : "Fill in the details for the new achievement."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    placeholder="Describe the achievement..."
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="issuer">Issuer</Label>
                    <Input
                      id="issuer"
                      value={formData.issuer}
                      onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                      placeholder="Organization or person"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">URL (Optional)</Label>
                  <Input
                    id="url"
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://example.com/achievement"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editingAchievement ? "Update Achievement" : "Create Achievement"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable columns={columns} data={achievements} searchKey="title" searchPlaceholder="Search achievements..." />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the achievement "{achievementToDelete?.title}".
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
