"use client"

import { useState } from "react"

export function useCrudModal<T = any>() {
  const [isOpen, setIsOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<T | null>(null)
  const [mode, setMode] = useState<"create" | "edit">("create")

  const openCreate = () => {
    setEditingItem(null)
    setMode("create")
    setIsOpen(true)
  }

  const openEdit = (item: T) => {
    setEditingItem(item)
    setMode("edit")
    setIsOpen(true)
  }

  const close = () => {
    setIsOpen(false)
    setEditingItem(null)
  }

  return {
    isOpen,
    editingItem,
    mode,
    openCreate,
    openEdit,
    close,
  }
}
