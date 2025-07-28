<template>
  <a
    :href="whatsappUrl"
    target="_blank"
    rel="noopener noreferrer"
    :class="['whatsapp-button', variant]"
    :aria-label="ariaLabel"
  >
    <svg
      class="whatsapp-icon"
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
    </svg>
    <span v-if="showText" class="whatsapp-text">{{ text }}</span>
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  phoneNumber?: string
  message?: string
  text?: string
  showText?: boolean
  variant?: 'icon' | 'button' | 'floating'
}

const props = withDefaults(defineProps<Props>(), {
  phoneNumber: '+447800123456', // Default UK phone number - replace with actual gym number
  message: 'Hi! I\'d like to know more about Stafford Thai Boxing Gym.',
  text: 'WhatsApp',
  showText: true,
  variant: 'button'
})

const whatsappUrl = computed(() => {
  const cleanPhone = props.phoneNumber.replace(/\D/g, '')
  const encodedMessage = encodeURIComponent(props.message)
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
})

const ariaLabel = computed(() => {
  return `Contact us on WhatsApp at ${props.phoneNumber}`
})
</script>

<style scoped>
.whatsapp-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  transition: all 0.2s ease;
  border-radius: 0.5rem;
}

.whatsapp-icon {
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
}

.whatsapp-text {
  font-weight: 500;
  white-space: nowrap;
}

/* Icon variant (for footer social links) */
.whatsapp-button.icon {
  width: 2.5rem;
  height: 2.5rem;
  justify-content: center;
  color: var(--text-secondary);
  background-color: transparent;
}

.whatsapp-button.icon:hover {
  color: #25D366;
  background-color: var(--hover-bg);
  transform: translateY(-1px);
}

.whatsapp-button.icon .whatsapp-text {
  display: none;
}

/* Button variant (for contact page) */
.whatsapp-button.button {
  padding: 0.75rem 1.5rem;
  background-color: #25D366;
  color: white;
  font-size: 0.875rem;
  border: 2px solid #25D366;
}

.whatsapp-button.button:hover {
  background-color: #128C7E;
  border-color: #128C7E;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
}

.whatsapp-button.button:active {
  transform: translateY(0);
}

/* Floating variant (could be used for a fixed floating button) */
.whatsapp-button.floating {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  width: 3.5rem;
  height: 3.5rem;
  justify-content: center;
  background-color: #25D366;
  color: white;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.whatsapp-button.floating:hover {
  background-color: #128C7E;
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
}

.whatsapp-button.floating .whatsapp-text {
  display: none;
}

.whatsapp-button.floating .whatsapp-icon {
  width: 2rem;
  height: 2rem;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .whatsapp-button.button {
    padding: 0.625rem 1.25rem;
    font-size: 0.8125rem;
  }

  .whatsapp-button.floating {
    bottom: 1rem;
    right: 1rem;
    width: 3rem;
    height: 3rem;
  }

  .whatsapp-button.floating .whatsapp-icon {
    width: 1.75rem;
    height: 1.75rem;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .whatsapp-button.icon {
    color: var(--text-secondary);
  }

  .whatsapp-button.icon:hover {
    color: #25D366;
    background-color: var(--hover-bg);
  }
}
</style>
