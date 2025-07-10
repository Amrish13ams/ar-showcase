"use client"

import { useState } from "react"

interface Toast {
  title?: string
  description: string
  variant?: "default" | "destructive"
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = ({ title, description, variant = "default" }: Toast) => {
    const newToast = { title, description, variant }
    setToasts((prev) => [...prev, newToast])

    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t !== newToast))
    }, 3000)

    // For now, just use console.log as a simple implementation
    console.log(`Toast: ${title ? title + " - " : ""}${description}`)
  }

  return { toast, toasts }
}
