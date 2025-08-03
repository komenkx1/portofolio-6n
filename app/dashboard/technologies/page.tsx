"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, Edit, Trash2, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CrudModal } from "@/components/ui/crud-modal"
import { DeleteDialog } from "@/components/ui/delete-dialog"
import { useCrudModal } from "@/hooks/use-crud-modal"
import { useDeleteDialog } from "@/hooks/use-delete-dialog"
import { useTechnologiesStore } from "@/stores/useTechnologiesStore"
import type { Technology } from "@/lib/types"

const technologySchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.enum(["frontend", "backend", "database", "devops", "mobile", "other"]),
  proficiency_level: z.enum(["beginner", "intermediate", "advanced", "expert"]),
  icon_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
})

type TechnologyFormData = z.infer<typeof technologySchema>

const categoryColors = {
  frontend: "bg-blue-100 text-blue-800",
  backend: "bg-green-100 text-green-800",
  database: "bg-purple-100 text-purple-800",
  devops: "bg-orange-100 text-orange-800",
  mobile: "bg-pink-100 text-pink-800",
  other: "bg-gray-100 text-gray-800",
}

const proficiencyColors = {
  beginner: "bg-red-100 text-red-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  advanced: "bg-blue-100 text-blue-800",
  expert: "bg-green-100 text-green-800",
}

export default function TechnologiesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const { technologies, isLoading, fetchTechnologies, createTechnology, updateTechnology, deleteTechnology } =
    useTechnologiesStore()
  const crudModal = useCrudModal<Technology>()
  const deleteDialog = useDeleteDialog<Technology>()

  const form = useForm<TechnologyFormData>({
    resolver: zodResolver(technologySchema),
    defaultValues: {
      name: "",
      category: "other",
      proficiency_level: "beginner",
      icon_url: "",
    },
  })

  useEffect(() => {
    fetchTechnologies()
  }, [fetchTechnologies])

  useEffect(() => {
    if (crudModal.editData) {
      form.reset({
        name: crudModal.editData.name,
        category: crudModal.editData.category,
        proficiency_level: crudModal.editData.proficiency_level,
        icon_url: crudModal.editData.icon_url || "",
      })
    } else {
      form.reset({
        name: "",
        category: "other",
        proficiency_level: "beginner",
        icon_url: "",
      })
    }
  }, [crudModal.editData, form])

  const filteredTechnologies = technologies.filter(
    (tech) =>
      tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const onSubmit = async (data: TechnologyFormData) => {
    try {
      if (crudModal.mode === "create") {
        await createTechnology(data)
      } else if (crudModal.editData) {
        await updateTechnology(crudModal.editData.id, data)
      }
      crudModal.close()
      form.reset()
    } catch (error) {
      console.error("Error saving technology:", error)
    }
  }

  const handleDelete = async () => {
    if (deleteDialog.deleteData) {
      try {
        await deleteTechnology(deleteDialog.deleteData.id)
        deleteDialog.close()
      } catch (error) {
        console.error("Error deleting technology:", error)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Technologies</h1>
        <Button onClick={crudModal.openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Technology
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Technologies</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search technologies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Proficiency</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredTechnologies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No technologies found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTechnologies.map((tech) => (
                  <TableRow key={tech.id}>
                    <TableCell className="font-medium">{tech.name}</TableCell>
                    <TableCell>
                      <Badge className={categoryColors[tech.category]}>{tech.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={proficiencyColors[tech.proficiency_level]}>{tech.proficiency_level}</Badge>
                    </TableCell>
                    <TableCell>
                      {tech.icon_url && (
                        <img src={tech.icon_url || "/placeholder.svg"} alt={tech.name} className="h-8 w-8" />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => crudModal.openEdit(tech)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deleteDialog.openDelete(tech)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CrudModal
        isOpen={crudModal.isOpen}
        onClose={crudModal.close}
        title={crudModal.mode === "create" ? "Add Technology" : "Edit Technology"}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Technology name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="frontend">Frontend</SelectItem>
                      <SelectItem value="backend">Backend</SelectItem>
                      <SelectItem value="database">Database</SelectItem>
                      <SelectItem value="devops">DevOps</SelectItem>
                      <SelectItem value="mobile">Mobile</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="proficiency_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proficiency Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select proficiency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/icon.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={crudModal.close}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : crudModal.mode === "create" ? "Create" : "Update"}
              </Button>
            </div>
          </form>
        </Form>
      </CrudModal>

      <DeleteDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.close}
        onConfirm={handleDelete}
        title="Delete Technology"
        description={`Are you sure you want to delete "${deleteDialog.deleteData?.name}"? This action cannot be undone.`}
      />
    </div>
  )
}
