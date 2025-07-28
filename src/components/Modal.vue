<!-- src/components/Modal.vue -->
<template>
  <teleport to="body">
    <div
      v-if="modalState.isOpen"
      class="modal-overlay"
      @click="handleOverlayClick"
    >
      <div class="modal-container" @click.stop>
        <div class="modal-content" :class="modalVariantClass">
          <!-- Modal Header -->
          <div class="modal-header" v-if="modalState.title">
            <h3 class="modal-title">{{ modalState.title }}</h3>
            <button
              @click="closeModal(false)"
              class="modal-close"
              aria-label="Close modal"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="modal-body">
            <!-- Icon based on variant -->
            <div class="modal-icon" v-if="showIcon">
              <!-- Danger/Delete Icon -->
              <div v-if="modalState.variant === 'danger'" class="icon-danger">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>

              <!-- Warning Icon -->
              <div v-else-if="modalState.variant === 'warning'" class="icon-warning">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <!-- Info Icon -->
              <div v-else-if="modalState.variant === 'info'" class="icon-info">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <!-- Primary/Default Icon -->
              <div v-else class="icon-primary">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            <!-- Message -->
            <div class="modal-message">
              <p>{{ modalState.message }}</p>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="modal-footer">
            <button
              v-if="modalState.showCancel"
              @click="closeModal(false)"
              class="btn btn-ghost"
            >
              {{ modalState.cancelText }}
            </button>
            <button
              @click="closeModal(true)"
              class="btn"
              :class="confirmButtonClass"
            >
              {{ modalState.confirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useModal } from '@/composables/useModal'

const { modalState, closeModal } = useModal()

const showIcon = computed(() => modalState.type === 'confirm' || modalState.variant !== 'primary')

const modalVariantClass = computed(() => {
  return `modal-variant-${modalState.variant}`
})

const confirmButtonClass = computed(() => {
  switch (modalState.variant) {
    case 'danger':
      return 'btn-secondary'
    case 'warning':
      return 'btn btn-primary'
    case 'info':
      return 'btn-primary'
    default:
      return 'btn-primary'
  }
})

const handleOverlayClick = () => {
  // Only close on overlay click for alerts, not confirms
  if (modalState.type === 'alert') {
    closeModal(false)
  }
}

// Handle ESC key
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && modalState.isOpen) {
    closeModal(false)
  }
}

// Add/remove event listeners
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

/* Modal Container */
.modal-container {
  width: 100%;
  max-width: 28rem;
  max-height: 90vh;
  overflow-y: auto;
}

/* Modal Content */
.modal-content {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  box-shadow: var(--shadow-strong);
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* Variant Styles */
.modal-variant-danger {
  border-top: 4px solid var(--accent-red);
}

.modal-variant-warning {
  border-top: 4px solid #f59e0b;
}

.modal-variant-info {
  border-top: 4px solid #3b82f6;
}

.modal-variant-primary {
  border-top: 4px solid var(--accent-gold);
}

/* Modal Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 0 1.5rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 0.5rem;
  background-color: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background-color: var(--hover-bg);
  color: var(--text-primary);
}

/* Modal Body */
.modal-body {
  padding: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.modal-icon {
  flex-shrink: 0;
}

.icon-danger,
.icon-warning,
.icon-info,
.icon-primary {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-danger {
  background-color: var(--accent-red);
  color: #ffffff;
}

.icon-warning {
  background-color: #f59e0b;
  color: #ffffff;
}

.icon-info {
  background-color: #3b82f6;
  color: #ffffff;
}

.icon-primary {
  background-color: var(--accent-gold);
  color: var(--bg-primary);
}

.modal-message {
  flex: 1;
  min-width: 0;
}

.modal-message p {
  color: var(--text-primary);
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
}

/* Modal Footer */
.modal-footer {
  padding: 0 1.5rem 1.5rem 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.modal-footer .btn {
  min-width: 5rem;
}

/* Responsive */
@media (max-width: 640px) {
  .modal-container {
    max-width: calc(100vw - 2rem);
  }

  .modal-body {
    flex-direction: column;
    text-align: center;
  }

  .modal-footer {
    flex-direction: column-reverse;
  }

  .modal-footer .btn {
    width: 100%;
  }
}
</style>
