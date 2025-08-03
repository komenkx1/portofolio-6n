"use client"

import { useState } from "react"

export function useDeleteDialog<T = any>() {
  const [isOpen, setIsOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<T | null>(null)

  const openDelete = (item: T) => {
    setItemToDelete(item)
    setIsOpen(true)
  }

  const close = () => {
    setIsOpen(false)
    setItemToDelete(null)
  }

  return {
    isOpen,
    itemToDelete,
    openDelete,
    close,
  }
}
