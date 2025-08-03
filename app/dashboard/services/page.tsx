"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search } from "lucide-react"
import { useServicesStore } from "@/stores/useServicesStore"
import { useCrudModal } from "@/hooks/use-crud-modal"
import { useDeleteDialog } from "@/hooks/use-delete-dialog"
import { CrudModal } from "@/components/ui/crud-modal"
import { DeleteDialog } from "@/components/ui/delete-dialog"
import type { Service } from "@/lib/types"

const serviceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  icon_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
})

type ServiceFormData = z.infer<typeof serviceSchema>

export default function ServicesPage() {
  const { services, isLoading, fetchServices, createService, updateService, deleteService } = useServicesStore()
  const modal = useCrudModal<Service>()
  const deleteDialog = useDeleteDialog<Service>()
  const [searchTerm, setSearchTerm] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      description: "",
      icon_url: "",
    },
  })

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  useEffect(() => {
    if (modal.editingItem) {
      form.reset({
        name: modal.editingItem.name,
        description: modal.editingItem.description,
        icon_url: modal.editingItem.icon_url || "",
      })
    } else {
      form.reset({
        name: "",
        description: "",
        icon_url: "",
      })
    }
  }, [modal.editingItem, form])

  const onSubmit = async (data: ServiceFormData) => {
    setIsSubmitting(true)
    try {
      if (modal.mode === "create") {
        await createService(data)
      } else if (modal.editingItem) {
        await updateService(modal.editingItem.id, data)
      }
      modal.close()
      form.reset()
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (deleteDialog.itemToDelete) {
      try {
        await deleteService(deleteDialog.itemToDelete.id)
        deleteDialog.close()
      } catch (error) {
        console.error("Error deleting service:", error)
      }
    }
  }

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Services</h1>
        <Button onClick={modal.openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Services</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
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
                <TableHead>Description</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredServices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No services found
                  </TableCell>
                </TableRow>
              ) : (
                filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell className="max-w-md truncate">{service.description}</TableCell>
                    <TableCell>
                      {service.icon_url ? (
                        <Badge variant="secondary">Has Icon</Badge>
                      ) : (
                        <Badge variant="outline">No Icon</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => modal.openEdit(service)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deleteDialog.openDelete(service)}>
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
        isOpen={modal.isOpen}
        onClose={modal.close}
        title={modal.mode === "create" ? "Add Service" : "Edit Service"}
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
                    <Input placeholder="Service name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Service description" {...field} />
                  </FormControl>
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
              <Button type="button" variant="outline" onClick={modal.close}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </CrudModal>

      <DeleteDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.close}
        onConfirm={handleDelete}
        title="Delete Service"
        description={`Are you sure you want to delete "${deleteDialog.itemToDelete?.name}"? This action cannot be undone.`}
      />
    </div>
  )
}
