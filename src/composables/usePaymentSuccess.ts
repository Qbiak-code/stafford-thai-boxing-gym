// src/composables/usePaymentSuccess.ts
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useModal } from '@/composables/useModal'

export function usePaymentSuccess() {
  const route = useRoute()
  const router = useRouter()
  const { alert } = useModal()

  const isProcessingSuccess = ref(false)

  const handlePaymentSuccess = async () => {
    const sessionId = route.query.session_id as string

    if (!sessionId) return

    isProcessingSuccess.value = true

    try {
      // The webhook should have already updated the subscription
      // We just need to show success message and refresh data
      await alert(
        'Payment successful! Your subscription is now active.',
        'Welcome to Stafford Thai Boxing!'
      )

      // Clean up URL and redirect to member dashboard
      await router.replace('/member/dashboard')

    } catch (error) {
      console.error('Payment success handling failed:', error)
      await alert(
        'Payment was successful, but there was an issue updating your account. Please contact support if you don\'t see your subscription activated.',
        'Payment Processed'
      )

      // Still redirect to dashboard even if there's an error
      await router.replace('/member/dashboard')
    } finally {
      isProcessingSuccess.value = false
    }
  }

  onMounted(() => {
    if (route.query.session_id) {
      handlePaymentSuccess()
    }
  })

  return {
    isProcessingSuccess,
    handlePaymentSuccess
  }
}
