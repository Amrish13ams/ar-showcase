"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

type NotificationType = {
  id: number
  title: string
  message: string
  time: string
  read: boolean
}

type DashboardContextType = {
  notifications: NotificationType[]
  unreadCount: number
  markAsRead: (id: number) => void
  markAllAsRead: () => void
  addNotification: (title: string, message: string) => void
  deleteProduct: (id: number) => void
  addProduct: (product: any) => void
  updateProduct: (id: number, data: any) => void
  toggleARStatus: (id: number) => void
  requestAR: (productId: number) => void
  cancelARRequest: (requestId: number) => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<NotificationType[]>([
    {
      id: 1,
      title: "New AR Request Approved",
      message: "Your AR request for MacBook Air M3 has been approved.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: "Product View Milestone",
      message: "Your iPhone 15 Pro has reached 100 views!",
      time: "Yesterday",
      read: false,
    },
    {
      id: 3,
      title: "Welcome to AR Showcase",
      message: "Welcome to your new AR Showcase dashboard!",
      time: "3 days ago",
      read: true,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    toast({
      title: "All notifications marked as read",
      description: "You have no unread notifications",
    })
  }

  const addNotification = (title: string, message: string) => {
    const newNotification = {
      id: Date.now(),
      title,
      message,
      time: "Just now",
      read: false,
    }
    setNotifications((prev) => [newNotification, ...prev])
  }

  const deleteProduct = (id: number) => {
    // In a real app, this would call an API
    toast({
      title: "Product deleted",
      description: `Product ID ${id} has been deleted successfully.`,
    })
  }

  const addProduct = (product: any) => {
    // In a real app, this would call an API
    toast({
      title: "Product added",
      description: `${product.name} has been added successfully.`,
    })
  }

  const updateProduct = (id: number, data: any) => {
    // In a real app, this would call an API
    toast({
      title: "Product updated",
      description: `${data.name || `Product ID ${id}`} has been updated successfully.`,
    })
  }

  const toggleARStatus = (id: number) => {
    // In a real app, this would call an API
    toast({
      title: "AR status updated",
      description: `AR status for Product ID ${id} has been toggled.`,
    })
  }

  const requestAR = (productId: number) => {
    // In a real app, this would call an API
    toast({
      title: "AR request submitted",
      description: "Your AR request has been submitted for review.",
    })
    addNotification("AR Request Submitted", "Your AR request has been submitted and is pending review.")
  }

  const cancelARRequest = (requestId: number) => {
    // In a real app, this would call an API
    toast({
      title: "AR request cancelled",
      description: `AR request #${requestId} has been cancelled.`,
    })
  }

  return (
    <DashboardContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
        deleteProduct,
        addProduct,
        updateProduct,
        toggleARStatus,
        requestAR,
        cancelARRequest,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export const useDashboard = () => {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider")
  }
  return context
}
