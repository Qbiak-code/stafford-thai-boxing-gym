// src/composables/useModal.ts
import { reactive } from "vue"

export interface ModalOptions {
  title?: string
  message: string
  type?: "confirm" | "alert" | "custom"
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
  variant?: "primary" | "danger" | "warning" | "info"
}

export interface ModalState {
  isOpen: boolean
  title: string
  message: string
  type: "confirm" | "alert" | "custom"
  confirmText: string
  cancelText: string
  showCancel: boolean
  variant: "primary" | "danger" | "warning" | "info"
  resolve?: (value: boolean) => void
}

// Global modal state - shared across all components
const modalState = reactive<ModalState>({
  isOpen: false,
  title: "",
  message: "",
  type: "alert",
  confirmText: "OK",
  cancelText: "Cancel",
  showCancel: false,
  variant: "primary",
  resolve: undefined,
})

// Debug logging
console.log("Modal state created:", modalState)

export function useModal() {
  const openModal = (options: ModalOptions): Promise<boolean> => {
    console.log("Opening modal with options:", options)
    return new Promise((resolve) => {
      modalState.isOpen = true
      modalState.title = options.title || ""
      modalState.message = options.message
      modalState.type = options.type || "alert"
      modalState.confirmText = options.confirmText || "OK"
      modalState.cancelText = options.cancelText || "Cancel"
      modalState.showCancel = options.showCancel ?? options.type === "confirm"
      modalState.variant = options.variant || "primary"
      modalState.resolve = resolve
      console.log("Modal state after opening:", modalState)
    })
  }

  const closeModal = (result: boolean = false) => {
    console.log("Closing modal with result:", result)
    modalState.isOpen = false
    if (modalState.resolve) {
      console.log("Resolving promise with:", result)
      modalState.resolve(result)
      modalState.resolve = undefined
    } else {
      console.log("No resolve function found!")
    }
  }

  const confirm = (message: string, title?: string): Promise<boolean> => {
    return openModal({
      title: title || "Confirm",
      message,
      type: "confirm",
      variant: "primary",
      confirmText: "Confirm",
      cancelText: "Cancel",
    })
  }

  const alert = (message: string, title?: string): Promise<boolean> => {
    return openModal({
      title: title || "Information",
      message,
      type: "alert",
      variant: "info",
      confirmText: "OK",
    })
  }

  const confirmDelete = (
    message: string = "Are you sure you want to delete this item?",
  ): Promise<boolean> => {
    return openModal({
      title: "Confirm Delete",
      message,
      type: "confirm",
      variant: "danger",
      confirmText: "Delete",
      cancelText: "Cancel",
    })
  }

  const confirmCancel = (
    message: string = "Are you sure you want to cancel?",
  ): Promise<boolean> => {
    return openModal({
      title: "Confirm Cancel",
      message,
      type: "confirm",
      variant: "warning",
      confirmText: "Yes, Cancel",
      cancelText: "Keep",
    })
  }

  return {
    modalState,
    openModal,
    closeModal,
    confirm,
    alert,
    confirmDelete,
    confirmCancel,
  }
}
